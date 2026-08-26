import { describe, expect, it } from "vitest"
import { buildSeedDonors } from "@infrastructure/database/drizzle/seedDonors"
import { BLOOD_TYPES } from "@domain/value_objects/BloodType"
import { ELIGIBILITY_DAYS } from "@domain/rules/donorEligibility"
import { isDonorEligible } from "@domain/rules/donorEligibility"
import { MS_PER_DAY } from "@domain/utils/dateUtils"

const NOW = new Date("2026-08-26T12:00:00.000Z").getTime()

const donors = buildSeedDonors(NOW)

describe("buildSeedDonors", () => {
	it("generates a thousand donors", () => {
		expect(donors).toHaveLength(1000)
	})

	it("is deterministic: the same seed yields the same donors", () => {
		expect(buildSeedDonors(NOW)).toEqual(donors)
	})

	it("gives every donor a distinct id and address", () => {
		expect(new Set(donors.map((donor) => donor.id)).size).toBe(donors.length)
		expect(new Set(donors.map((donor) => donor.email)).size).toBe(donors.length)
	})

	/**
	 * Campaigns e-mail eligible donors for real, so a seeded address that could reach
	 * a person is a live hazard, not a cosmetic issue.
	 */
	it("keeps every address inside the reserved example.com domain", () => {
		for (const donor of donors) {
			expect(donor.email).toMatch(/^[a-z0-9.]+@example\.com$/)
		}
	})

	it("covers every blood type", () => {
		const present = new Set(donors.map((donor) => donor.bloodType))

		expect([...present].sort()).toEqual([...BLOOD_TYPES].sort())
	})

	it("splits meaningfully between eligible and waiting donors", () => {
		const eligible = donors.filter((donor) =>
			isDonorEligible(donor.sex, donor.lastDonationDate, new Date(NOW)),
		).length

		// Both sides must be worth filtering on; the exact ratio is free to drift.
		expect(eligible).toBeGreaterThan(300)
		expect(donors.length - eligible).toBeGreaterThan(300)
	})

	it("includes donors who have never donated", () => {
		const neverDonated = donors.filter(
			(donor) => donor.lastDonationDate === null,
		)

		expect(neverDonated.length).toBeGreaterThan(50)
	})

	/**
	 * The point of the boundary fixtures is to sit next to a threshold — but always the
	 * donor's *own* threshold. A man described by the women's interval (or vice versa)
	 * is a donor whose data belongs to a rule that does not apply to him.
	 */
	it("never describes a donor by the other sex's interval", () => {
		for (const [index, donor] of donors.slice(0, 8).entries()) {
			if (donor.lastDonationDate === null) continue

			const days = Math.round(
				(NOW - donor.lastDonationDate.getTime()) / MS_PER_DAY,
			)
			const ownThreshold = ELIGIBILITY_DAYS[donor.sex]

			expect(
				Math.abs(days - ownThreshold),
				`donor ${index} (${donor.sex}) sits ${days}d out, own threshold is ${ownThreshold}d`,
			).toBeLessThanOrEqual(1)
		}
	})

	it("pins the eligibility boundaries so a fresh database always has them", () => {
		const daysSince = (index: number) => {
			const date = donors[index]?.lastDonationDate
			return date === null || date === undefined
				? null
				: Math.round((NOW - date.getTime()) / MS_PER_DAY)
		}

		expect(donors.slice(0, 6).map((donor) => donor.sex)).toEqual([
			"male",
			"male",
			"male",
			"female",
			"female",
			"female",
		])
		expect([0, 1, 2].map(daysSince)).toEqual([
			ELIGIBILITY_DAYS.male - 1,
			ELIGIBILITY_DAYS.male,
			ELIGIBILITY_DAYS.male + 1,
		])
		expect([3, 4, 5].map(daysSince)).toEqual([
			ELIGIBILITY_DAYS.female - 1,
			ELIGIBILITY_DAYS.female,
			ELIGIBILITY_DAYS.female + 1,
		])
	})
})
