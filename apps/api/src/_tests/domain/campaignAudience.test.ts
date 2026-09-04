import { describe, expect, it } from "vitest"
import {
	type CampaignAudienceDonor,
	countEligibleInAudience,
	isInCampaignAudience,
	selectCampaignAudience,
} from "@domain/rules/campaignAudience"
import { ELIGIBILITY_DAYS } from "@domain/rules/donorEligibility"
import { MS_PER_DAY } from "@domain/utils/dateUtils"
import { BLOOD_TYPES, type BloodType } from "@domain/value_objects/BloodType"

const NOW = new Date("2026-09-01T12:00:00.000Z")

const daysAgo = (days: number) => new Date(NOW.getTime() - days * MS_PER_DAY)

const MATCHING_ELIGIBLE: CampaignAudienceDonor = {
	sex: "male",
	bloodType: "O+",
	lastDonationDate: daysAgo(ELIGIBILITY_DAYS.male),
}
const MATCHING_WAITING: CampaignAudienceDonor = {
	sex: "male",
	bloodType: "O+",
	lastDonationDate: daysAgo(ELIGIBILITY_DAYS.male - 1),
}
const OTHER_TYPE_ELIGIBLE: CampaignAudienceDonor = {
	sex: "female",
	bloodType: "A-",
	lastDonationDate: null,
}
const OTHER_TYPE_WAITING: CampaignAudienceDonor = {
	sex: "female",
	bloodType: "A-",
	lastDonationDate: daysAgo(1),
}

const POOL = [
	MATCHING_ELIGIBLE,
	MATCHING_WAITING,
	OTHER_TYPE_ELIGIBLE,
	OTHER_TYPE_WAITING,
]

describe("campaign audience", () => {
	describe("segmented", () => {
		it("keeps only donors of the targeted type who may donate again", () => {
			expect(selectCampaignAudience(POOL, "segmented", "O+", NOW)).toEqual([
				MATCHING_ELIGIBLE,
			])
		})

		it("excludes a matching donor still inside their waiting interval", () => {
			expect(
				isInCampaignAudience(MATCHING_WAITING, "segmented", "O+", NOW),
			).toBe(false)
		})

		it("excludes an eligible donor of another blood type", () => {
			expect(
				isInCampaignAudience(OTHER_TYPE_ELIGIBLE, "segmented", "O+", NOW),
			).toBe(false)
		})
	})

	/**
	 * The Rh sign is half the identity of a blood type, and the pool above only ever
	 * contrasts types that differ in both letter and sign. These cases isolate each
	 * half: same ABO group with the opposite sign, and the same sign with a different
	 * group. Selection is an exact match on the pair — the code carries no ABO/Rh
	 * compatibility table, so no donor is ever a substitute for another type.
	 */
	describe("blood type and Rh factor", () => {
		const eligible = (bloodType: BloodType): CampaignAudienceDonor => ({
			sex: "male",
			bloodType,
			lastDonationDate: null,
		})

		it("excludes the opposite Rh of the same group", () => {
			expect(isInCampaignAudience(eligible("O-"), "segmented", "O+", NOW)).toBe(
				false,
			)
			expect(isInCampaignAudience(eligible("O+"), "segmented", "O-", NOW)).toBe(
				false,
			)
		})

		it("excludes a different group carrying the same Rh sign", () => {
			expect(
				isInCampaignAudience(eligible("A+"), "segmented", "AB+", NOW),
			).toBe(false)
			expect(
				isInCampaignAudience(eligible("B-"), "segmented", "AB-", NOW),
			).toBe(false)
		})

		it("does not treat O- as a universal donor", () => {
			const universalPool = BLOOD_TYPES.map(eligible)

			for (const target of BLOOD_TYPES) {
				const audience = selectCampaignAudience(
					universalPool,
					"segmented",
					target,
					NOW,
				)

				expect(audience.map((donor) => donor.bloodType)).toEqual([target])
			}
		})

		it("selects every eligible donor of the targeted type and no other", () => {
			// Two donors per type, so a passing assertion cannot be a single lucky row.
			const pool = BLOOD_TYPES.flatMap((bloodType) => [
				eligible(bloodType),
				eligible(bloodType),
			])

			for (const target of BLOOD_TYPES) {
				const audience = selectCampaignAudience(pool, "segmented", target, NOW)

				expect(audience).toHaveLength(2)
				expect(audience.every((donor) => donor.bloodType === target)).toBe(true)
			}
		})

		it("still applies the waiting interval within the targeted type", () => {
			const waiting: CampaignAudienceDonor = {
				sex: "male",
				bloodType: "O-",
				lastDonationDate: daysAgo(ELIGIBILITY_DAYS.male - 1),
			}

			expect(
				selectCampaignAudience(
					[eligible("O-"), waiting],
					"segmented",
					"O-",
					NOW,
				),
			).toEqual([eligible("O-")])
		})
	})

	describe("generic", () => {
		it("keeps the whole base, filtering nothing", () => {
			expect(selectCampaignAudience(POOL, "generic", null, NOW)).toEqual(POOL)
		})

		it("reaches donors who cannot possibly confirm", () => {
			expect(isInCampaignAudience(MATCHING_WAITING, "generic", null, NOW)).toBe(
				true,
			)
			expect(
				isInCampaignAudience(OTHER_TYPE_WAITING, "generic", null, NOW),
			).toBe(true)
		})
	})

	describe("countEligibleInAudience", () => {
		it("counts the messages that reached someone able to answer", () => {
			expect(countEligibleInAudience(POOL, NOW)).toBe(2)
		})

		it("equals the audience size for a segmented campaign", () => {
			const audience = selectCampaignAudience(POOL, "segmented", "O+", NOW)

			expect(countEligibleInAudience(audience, NOW)).toBe(audience.length)
		})
	})

	it("resolves eligibility against the moment it is given", () => {
		const tomorrow = new Date(NOW.getTime() + MS_PER_DAY)

		expect(isInCampaignAudience(MATCHING_WAITING, "segmented", "O+", NOW)).toBe(
			false,
		)
		expect(
			isInCampaignAudience(MATCHING_WAITING, "segmented", "O+", tomorrow),
		).toBe(true)
	})
})
