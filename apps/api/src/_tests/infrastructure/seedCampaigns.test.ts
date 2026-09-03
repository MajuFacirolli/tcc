import { describe, expect, it } from "vitest"
import { buildSeedDonors } from "@infrastructure/database/drizzle/seedDonors"
import {
	buildSeedCampaigns,
	type SeedCampaignDonor,
} from "@infrastructure/database/drizzle/seedCampaigns"
import { isDonorEligible } from "@domain/rules/donorEligibility"
import { SIMULATION_CONFIG } from "@domain/simulation/simulationConfig"
import { MS_PER_DAY } from "@domain/utils/dateUtils"
import { resolveMetricsWindow } from "@domain/utils/metricsWindow"
import type { BloodBankStatus } from "@domain/value_objects/BloodBankStatus"
import type { BloodType } from "@domain/value_objects/BloodType"
import type { CampaignKind } from "@domain/value_objects/CampaignKind"

const NOW = new Date("2026-09-01T18:00:00.000Z")

/** The trial is designed to fit inside two weeks; nothing may predate it. */
const TRIAL_DAYS = 14

/** Mirrors the stock levels `seed.ts` writes. */
const STOCK_STATUS: Record<BloodType, BloodBankStatus> = {
	"A+": "stable",
	"A-": "stable",
	"B+": "warning",
	"B-": "critical",
	"AB+": "warning",
	"AB-": "stable",
	"O+": "critical",
	"O-": "critical",
}

const donorPool: SeedCampaignDonor[] = buildSeedDonors(NOW.getTime())

const build = () =>
	buildSeedCampaigns({
		donors: donorPool,
		stockStatusByBloodType: STOCK_STATUS,
		now: NOW,
	})

const { campaigns, confirmations } = build()

const byDonorId = new Map(donorPool.map((donor) => [donor.id, donor]))
const campaignById = new Map(campaigns.map((row) => [row.id, row]))

const ofKind = (kind: CampaignKind) =>
	campaigns.filter((campaign) => campaign.kind === kind)

function arm(kind: CampaignKind) {
	const rows = ofKind(kind)
	const notified = rows.reduce((total, row) => total + row.notifiedCount, 0)
	const eligible = rows.reduce(
		(total, row) => total + row.totalEligibleDonors,
		0,
	)
	const confirmed = rows.reduce(
		(total, row) => total + row.intentionConfirmationsCount,
		0,
	)

	return {
		campaignsCount: rows.length,
		notified,
		eligible,
		confirmed,
		conversionRate: confirmed / notified,
		eligibleConversionRate: confirmed / eligible,
		wastedMessageRate: (notified - eligible) / notified,
	}
}

describe("buildSeedCampaigns", () => {
	it("runs both arms of the trial in equal number", () => {
		expect(ofKind("generic").length).toBe(ofKind("segmented").length)
		expect(ofKind("generic").length).toBeGreaterThanOrEqual(2)
	})

	it("asks for no blood type in the generic arm, and always one in the segmented", () => {
		for (const campaign of ofKind("generic")) {
			expect(campaign.bloodType).toBeNull()
		}

		for (const campaign of ofKind("segmented")) {
			expect(campaign.bloodType).not.toBeNull()
		}
	})

	/**
	 * An arm that only ever ran on scarce blood types would be comparing segmentation
	 * against urgency.
	 */
	it("spans several stock levels in the segmented arm", () => {
		const levels = new Set(
			ofKind("segmented").map(
				(campaign) => STOCK_STATUS[campaign.bloodType as BloodType],
			),
		)

		expect(levels.size).toBeGreaterThanOrEqual(2)
	})

	it("is deterministic: the same donors and clock yield the same trial", () => {
		expect(build()).toEqual({ campaigns, confirmations })
	})

	it("gives every row a distinct id, and every confirmation a distinct token", () => {
		expect(new Set(campaigns.map((row) => row.id)).size).toBe(campaigns.length)
		expect(new Set(confirmations.map((row) => row.id)).size).toBe(
			confirmations.length,
		)
		expect(new Set(confirmations.map((row) => row.token)).size).toBe(
			confirmations.length,
		)
	})

	it("never notifies the same donor twice in one campaign", () => {
		const pairs = confirmations.map((row) => `${row.campaignId}:${row.donorId}`)

		expect(new Set(pairs).size).toBe(pairs.length)
	})

	it("dates nothing in the future", () => {
		for (const campaign of campaigns) {
			expect(campaign.createdAt.getTime()).toBeLessThanOrEqual(NOW.getTime())
		}

		for (const confirmation of confirmations) {
			expect(confirmation.createdAt.getTime()).toBeLessThanOrEqual(
				NOW.getTime(),
			)
			expect(confirmation.confirmedAt?.getTime() ?? 0).toBeLessThanOrEqual(
				NOW.getTime(),
			)
		}
	})

	/** A campaign before the trial would report on a period the app was not in use. */
	it("keeps the whole trial inside its two-week window", () => {
		const earliest = Math.min(
			...campaigns.map((campaign) => campaign.createdAt.getTime()),
		)

		expect((NOW.getTime() - earliest) / MS_PER_DAY).toBeLessThanOrEqual(
			TRIAL_DAYS,
		)
	})

	it("notifies only eligible donors of the targeted type in the segmented arm", () => {
		for (const campaign of ofKind("segmented")) {
			const rows = confirmations.filter((row) => row.campaignId === campaign.id)

			for (const row of rows) {
				const donor = byDonorId.get(row.donorId)
				if (!donor) throw new Error("unreachable")

				expect(donor.bloodType).toBe(campaign.bloodType)

				const lastDonation =
					donor.lastDonationDate && donor.lastDonationDate <= campaign.createdAt
						? donor.lastDonationDate
						: null

				expect(
					isDonorEligible(donor.sex, lastDonation, campaign.createdAt),
					`donor ${donor.id} was waiting when ${campaign.id} went out`,
				).toBe(true)
			}
		}
	})

	it("notifies the whole donor base in the generic arm", () => {
		for (const campaign of ofKind("generic")) {
			expect(campaign.notifiedCount).toBe(donorPool.length)
		}
	})

	it("keeps each campaign's stored counters in step with its confirmations", () => {
		for (const campaign of campaigns) {
			const rows = confirmations.filter((row) => row.campaignId === campaign.id)
			const confirmed = rows.filter((row) => row.confirmedAt !== null)

			expect(campaign.notifiedCount).toBe(rows.length)
			expect(campaign.intentionConfirmationsCount).toBe(confirmed.length)
			expect(campaign.totalEligibleDonors).toBeLessThanOrEqual(
				campaign.notifiedCount,
			)

			const average =
				confirmed.length === 0
					? 0
					: Math.round(
							confirmed.reduce(
								(total, row) =>
									total +
									Math.round(
										((row.confirmedAt as Date).getTime() -
											row.createdAt.getTime()) /
											1000,
									),
								0,
							) / confirmed.length,
						)

			expect(campaign.averageResponseTime).toBe(average)
		}
	})

	it("spends no message on an ineligible donor in the segmented arm", () => {
		for (const campaign of ofKind("segmented")) {
			expect(campaign.totalEligibleDonors).toBe(campaign.notifiedCount)
		}

		expect(arm("segmented").wastedMessageRate).toBe(0)
		expect(arm("generic").wastedMessageRate).toBeGreaterThan(0.1)
	})

	/**
	 * The result the whole trial exists to produce. Both arms are drawn from the same
	 * model over the same donor base, so the gap is attributable to the audience rule
	 * and nothing else.
	 */
	it("converts substantially better when segmented", () => {
		const generic = arm("generic")
		const segmented = arm("segmented")

		expect(segmented.conversionRate).toBeGreaterThan(generic.conversionRate * 2)

		// And the gap survives removing the eligibility filter from the denominator,
		// which is what attributes part of it to blood-type targeting rather than all
		// of it to eligibility.
		expect(segmented.eligibleConversionRate).toBeGreaterThan(
			generic.eligibleConversionRate,
		)
	})

	it("converts better under critical stock than under stable stock", () => {
		const rateFor = (status: BloodBankStatus) => {
			const matching = ofKind("segmented").filter(
				(campaign) => STOCK_STATUS[campaign.bloodType as BloodType] === status,
			)

			const notified = matching.reduce((t, c) => t + c.notifiedCount, 0)
			const confirmed = matching.reduce(
				(t, c) => t + c.intentionConfirmationsCount,
				0,
			)

			return confirmed / notified
		}

		expect(rateFor("critical")).toBeGreaterThan(rateFor("stable"))
	})

	it("leaves at least one campaign open, so the daily panel has one to count", () => {
		expect(
			campaigns.filter((campaign) => campaign.status === "active").length,
		).toBeGreaterThanOrEqual(1)
	})

	/** The comparison has to hold up inside the default window and the previous one. */
	it("puts both arms in the week window and the week before it", () => {
		const window = resolveMetricsWindow("week", NOW)

		const kindsIn = (from: Date, to: Date) =>
			new Set(
				campaigns
					.filter(
						(campaign) => campaign.createdAt >= from && campaign.createdAt < to,
					)
					.map((campaign) => campaign.kind),
			)

		expect([...kindsIn(window.from, window.to)].sort()).toEqual([
			"generic",
			"segmented",
		])
		expect([...kindsIn(window.previousFrom, window.previousTo)].sort()).toEqual(
			["generic", "segmented"],
		)
	})

	it("spreads notifications across several days of the week window", () => {
		const window = resolveMetricsWindow("week", NOW)

		const days = new Set(
			confirmations
				.filter((row) => row.createdAt >= window.from)
				.map((row) => Math.floor(row.createdAt.getTime() / MS_PER_DAY)),
		)

		expect(days.size).toBeGreaterThanOrEqual(5)
	})

	it("reports response times in hours, the unit the dashboard formats", () => {
		const withResponses = campaigns.filter(
			(campaign) => campaign.intentionConfirmationsCount > 0,
		)

		expect(withResponses.length).toBe(campaigns.length)

		// The delay draw is a shifted exponential with a six-hour mean truncated at 48h.
		// Only the trial-wide average is held to that mean: a single campaign can average
		// well above it on a handful of draws from a long tail.
		const overall =
			withResponses.reduce(
				(total, campaign) =>
					total +
					campaign.averageResponseTime * campaign.intentionConfirmationsCount,
				0,
			) /
			withResponses.reduce(
				(total, campaign) => total + campaign.intentionConfirmationsCount,
				0,
			)

		expect(overall).toBeGreaterThan(4 * 60 * 60)
		expect(overall).toBeLessThan(9 * 60 * 60)

		for (const campaign of withResponses) {
			expect(campaign.averageResponseTime).toBeGreaterThan(
				SIMULATION_CONFIG.minResponseDelaySeconds,
			)
			expect(campaign.averageResponseTime).toBeLessThanOrEqual(
				SIMULATION_CONFIG.maxResponseDelaySeconds,
			)
		}
	})

	it("attributes each confirmation to a campaign that exists", () => {
		for (const row of confirmations) {
			expect(campaignById.has(row.campaignId)).toBe(true)
		}
	})
})
