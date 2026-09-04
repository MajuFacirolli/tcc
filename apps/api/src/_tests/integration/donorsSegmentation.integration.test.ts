import { afterAll, beforeEach, describe, expect, it } from "vitest"
import { DrizzleDonorsRepository } from "@infrastructure/database/repositories/DrizzleDonorsRepository"
import {
	ELIGIBILITY_DAYS,
	isDonorEligible,
} from "@domain/rules/donorEligibility"
import { selectCampaignAudience } from "@domain/rules/campaignAudience"
import { BLOOD_TYPES } from "@domain/value_objects/BloodType"
import { closeDatabase, truncateAll } from "./helpers/database"
import { daysAgo, insertDonors } from "./helpers/fixtures"

/**
 * Criterion 2, against the database: the donor filter by blood type and Rh factor, and
 * the parity of the two encodings of the eligibility rule.
 *
 * The rule is written twice — `isDonorEligible` in TypeScript for rows already in
 * memory, and `donorEligibilitySql` for counting without loading them. Nothing in the
 * type system ties them together, so a change to one can silently contradict the
 * other. These tests are what would catch that.
 */
describe("donor selection against the database", () => {
	const repository = new DrizzleDonorsRepository()

	beforeEach(truncateAll)
	afterAll(closeDatabase)

	/** One donor of every type, so a query cannot pass by having nothing to exclude. */
	async function insertOnePerType() {
		await insertDonors(
			BLOOD_TYPES.map((bloodType) => ({
				id: `donor-${bloodType}`,
				name: `Doador ${bloodType}`,
				bloodType,
				lastDonationDate: null,
			})),
		)
	}

	it("loads only the targeted type, never the opposite Rh", async () => {
		await insertOnePerType()

		const negatives = await repository.findByBloodType("A-")

		expect(negatives.map((donor) => donor.bloodType)).toEqual(["A-"])

		const positives = await repository.findByBloodType("A+")

		expect(positives.map((donor) => donor.bloodType)).toEqual(["A+"])
	})

	it("loads every donor for a generic campaign", async () => {
		await insertOnePerType()

		const all = await repository.findAll()

		expect(all).toHaveLength(BLOOD_TYPES.length)
	})

	/**
	 * The boundary donors are the whole point: a donor exactly on their threshold, and
	 * one a day short of it, for each sex. If the SQL rounded or compared differently
	 * from the TypeScript, these are the rows that would disagree.
	 */
	it("agrees with the in-memory rule on donors sitting at the boundary", async () => {
		const fixtures = [
			{
				id: "m-below",
				name: "Homem aquém",
				sex: "male" as const,
				bloodType: "O-" as const,
				lastDonationDate: daysAgo(ELIGIBILITY_DAYS.male - 1),
			},
			{
				id: "m-at",
				name: "Homem no limite",
				sex: "male" as const,
				bloodType: "O-" as const,
				lastDonationDate: daysAgo(ELIGIBILITY_DAYS.male),
			},
			{
				id: "f-below",
				name: "Mulher aquém",
				sex: "female" as const,
				bloodType: "O-" as const,
				lastDonationDate: daysAgo(ELIGIBILITY_DAYS.female - 1),
			},
			{
				id: "f-at",
				name: "Mulher no limite",
				sex: "female" as const,
				bloodType: "O-" as const,
				lastDonationDate: daysAgo(ELIGIBILITY_DAYS.female),
			},
			{
				id: "never",
				name: "Nunca doou",
				sex: "female" as const,
				bloodType: "O-" as const,
				lastDonationDate: null,
			},
		]

		await insertDonors(fixtures)

		// What SQL says, counted in the database.
		const counted = await repository.countEligibleByBloodType("O-")

		// What TypeScript says, over the very same rows.
		const now = new Date()
		const expected = fixtures.filter((donor) =>
			isDonorEligible(donor.sex, donor.lastDonationDate, now),
		)

		expect(expected.map((donor) => donor.id).sort()).toEqual([
			"f-at",
			"m-at",
			"never",
		])
		expect(counted).toBe(expected.length)
	})

	it("selects the same audience the eligible count promises", async () => {
		await insertDonors([
			{
				id: "eligible",
				name: "Apto",
				bloodType: "B-",
				lastDonationDate: daysAgo(ELIGIBILITY_DAYS.male + 1),
			},
			{
				id: "waiting",
				name: "Aguardando",
				bloodType: "B-",
				lastDonationDate: daysAgo(ELIGIBILITY_DAYS.male - 1),
			},
			{
				id: "other-rh",
				name: "Outro Rh",
				bloodType: "B+",
				lastDonationDate: null,
			},
		])

		const candidates = await repository.findByBloodType("B-")
		const audience = selectCampaignAudience(candidates, "segmented", "B-")

		expect(audience.map((donor) => donor.id)).toEqual(["eligible"])
		expect(await repository.countEligibleByBloodType("B-")).toBe(
			audience.length,
		)
	})
})
