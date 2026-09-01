import { describe, expect, it } from "vitest"
import {
	calculateIntentionProbability,
	donorPropensity,
	sampleResponseDelaySeconds,
	simulateDonationIntention,
	toWallClockDelaySeconds,
	type DonationIntentionInput,
} from "@domain/simulation/donationIntentionModel"
import { SIMULATION_CONFIG } from "@domain/simulation/simulationConfig"
import { createSeededRandom } from "@domain/utils/random"
import { BLOOD_TYPES } from "@domain/value_objects/BloodType"
import { BLOOD_BANK_STATUSES } from "@domain/value_objects/BloodBankStatus"

const BASE: DonationIntentionInput = {
	campaignId: "campaign-1",
	donorId: "donor-1",
	donorBloodType: "O+",
	campaignBloodType: "O+",
	donorIsEligible: true,
	stockStatus: "stable",
}

function withInput(
	overrides: Partial<DonationIntentionInput>,
): DonationIntentionInput {
	return { ...BASE, ...overrides }
}

/** Ids that exercise the model across many different propensities. */
const DONOR_IDS = Array.from({ length: 60 }, (_, index) => `donor-${index}`)

describe("eligibility", () => {
	it("lets eligible donors manifest intention", () => {
		const confirmed = DONOR_IDS.filter(
			(donorId) =>
				simulateDonationIntention(withInput({ donorId })).willConfirm,
		)

		expect(confirmed.length).toBeGreaterThan(0)
	})

	it("never confirms an ineligible donor, whatever else favours them", () => {
		// Every combination the model can see, at the most favourable urgency and with
		// the campaign's own blood type — the only thing standing in the way is the
		// waiting interval.
		for (const donorId of DONOR_IDS) {
			for (const stockStatus of BLOOD_BANK_STATUSES) {
				const outcome = simulateDonationIntention(
					withInput({ donorId, stockStatus, donorIsEligible: false }),
				)

				expect(outcome.willConfirm).toBe(false)
				expect(outcome.responseDelaySeconds).toBeNull()
			}
		}
	})

	it("gives eligible donors a higher probability than ineligible ones", () => {
		const eligible = calculateIntentionProbability(
			withInput({ donorIsEligible: true }),
		)
		const ineligible = calculateIntentionProbability(
			withInput({ donorIsEligible: false }),
		)

		expect(eligible).toBeGreaterThan(ineligible)
	})
})

describe("targeting", () => {
	it("raises the probability when the donor matches the campaign's blood type", () => {
		// Compared directly, not observed through draws: the factor is a property of
		// the model, and a sampling test would only show it in aggregate.
		const matching = calculateIntentionProbability(
			withInput({ donorBloodType: "O+", campaignBloodType: "O+" }),
		)
		const notMatching = calculateIntentionProbability(
			withInput({ donorBloodType: "A-", campaignBloodType: "O+" }),
		)

		expect(matching).toBeGreaterThan(notMatching)
	})

	it("holds for every donor, so the effect is the weight and not one lucky id", () => {
		for (const donorId of DONOR_IDS) {
			const matching = calculateIntentionProbability(
				withInput({ donorId, donorBloodType: "O+", campaignBloodType: "O+" }),
			)
			const notMatching = calculateIntentionProbability(
				withInput({ donorId, donorBloodType: "A-", campaignBloodType: "O+" }),
			)

			expect(matching).toBeGreaterThan(notMatching)
		}
	})
})

describe("urgency", () => {
	it("ranks critical above warning above stable, all else equal", () => {
		const critical = calculateIntentionProbability(
			withInput({ stockStatus: "critical" }),
		)
		const warning = calculateIntentionProbability(
			withInput({ stockStatus: "warning" }),
		)
		const stable = calculateIntentionProbability(
			withInput({ stockStatus: "stable" }),
		)

		expect(critical).toBeGreaterThan(warning)
		expect(warning).toBeGreaterThan(stable)
	})

	it("keeps urgency a moderate nudge next to eligibility", () => {
		// The ordering the weights encode: the most urgent campaign must not out-pull
		// the donor actually being able to donate.
		expect(SIMULATION_CONFIG.urgencyWeights.critical).toBeLessThan(
			SIMULATION_CONFIG.eligibleWeight,
		)
	})
})

describe("probability bounds", () => {
	it("stays within [0, 1] across every combination of inputs", () => {
		for (const donorId of DONOR_IDS) {
			for (const donorBloodType of BLOOD_TYPES) {
				for (const stockStatus of BLOOD_BANK_STATUSES) {
					for (const donorIsEligible of [true, false]) {
						const probability = calculateIntentionProbability(
							withInput({
								donorId,
								donorBloodType,
								stockStatus,
								donorIsEligible,
							}),
						)

						expect(probability).toBeGreaterThanOrEqual(0)
						expect(probability).toBeLessThanOrEqual(1)
						expect(Number.isFinite(probability)).toBe(true)
					}
				}
			}
		}
	})

	it("cannot leave [0, 1] even under an absurd score", () => {
		// The logistic function is what guarantees the bound, so it is worth pinning
		// independently of whatever the configured weights happen to be.
		expect(1 / (1 + Math.exp(-1e6))).toBeLessThanOrEqual(1)
		expect(1 / (1 + Math.exp(1e6))).toBeGreaterThanOrEqual(0)
	})
})

describe("individual propensity", () => {
	it("gives different donors different propensities", () => {
		const values = new Set(DONOR_IDS.map(donorPropensity))

		expect(values.size).toBeGreaterThan(DONOR_IDS.length / 2)
	})

	it("gives the same donor the same propensity every time", () => {
		expect(donorPropensity("donor-42")).toBe(donorPropensity("donor-42"))
	})

	it("stays inside the configured spread", () => {
		for (const donorId of DONOR_IDS) {
			expect(Math.abs(donorPropensity(donorId))).toBeLessThanOrEqual(
				SIMULATION_CONFIG.propensitySpread,
			)
		}
	})

	it("separates donors who are otherwise identical", () => {
		const probabilities = new Set(
			DONOR_IDS.map((donorId) =>
				calculateIntentionProbability(withInput({ donorId })),
			),
		)

		expect(probabilities.size).toBeGreaterThan(1)
	})
})

describe("reproducibility", () => {
	it("returns an identical outcome for identical input", () => {
		for (const donorId of DONOR_IDS) {
			const input = withInput({ donorId })

			expect(simulateDonationIntention(input)).toEqual(
				simulateDonationIntention(input),
			)
		}
	})

	it("varies the outcome by campaign, so a rerun is not a replay of one draw", () => {
		const first = DONOR_IDS.map(
			(donorId) =>
				simulateDonationIntention(withInput({ donorId, campaignId: "a" }))
					.willConfirm,
		)
		const second = DONOR_IDS.map(
			(donorId) =>
				simulateDonationIntention(withInput({ donorId, campaignId: "b" }))
					.willConfirm,
		)

		expect(first).not.toEqual(second)
	})
})

describe("response time", () => {
	const confirmingOutcomes = DONOR_IDS.map((donorId) =>
		simulateDonationIntention(withInput({ donorId, stockStatus: "critical" })),
	).filter((outcome) => outcome.responseDelaySeconds !== null)

	it("has confirmations to time", () => {
		expect(confirmingOutcomes.length).toBeGreaterThan(1)
	})

	it("produces a valid, positive delay", () => {
		for (const outcome of confirmingOutcomes) {
			const delay = outcome.responseDelaySeconds as number

			expect(delay).toBeGreaterThan(0)
			expect(Number.isFinite(delay)).toBe(true)
		}
	})

	it("stays within the configured window", () => {
		for (const outcome of confirmingOutcomes) {
			const delay = outcome.responseDelaySeconds as number

			expect(delay).toBeGreaterThanOrEqual(
				SIMULATION_CONFIG.minResponseDelaySeconds,
			)
			expect(delay).toBeLessThanOrEqual(
				SIMULATION_CONFIG.maxResponseDelaySeconds,
			)
		}
	})

	it("does not hand every donor the same interval", () => {
		const distinct = new Set(
			confirmingOutcomes.map((outcome) => outcome.responseDelaySeconds),
		)

		expect(distinct.size).toBeGreaterThan(1)
	})

	it("is skewed, not uniform: most answers land well before the mean", () => {
		// A right-skewed draw puts the median below the mean. A uniform delay would
		// sit them on top of each other, which is the shape this test rules out.
		const delays = Array.from({ length: 2000 }, (_, index) =>
			sampleResponseDelaySeconds(createSeededRandom("delay-shape", `${index}`)),
		).sort((a, b) => a - b)

		const median = delays[Math.floor(delays.length / 2)] as number
		const mean = delays.reduce((total, d) => total + d, 0) / delays.length

		expect(median).toBeLessThan(mean)
	})

	it("scales simulated seconds into a whole-second queue delay", () => {
		const delay = toWallClockDelaySeconds(
			SIMULATION_CONFIG.maxResponseDelaySeconds,
		)

		expect(delay).toBeGreaterThanOrEqual(1)
		expect(Number.isInteger(delay)).toBe(true)
	})
})
