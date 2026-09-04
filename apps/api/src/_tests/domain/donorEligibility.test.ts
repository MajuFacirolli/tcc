import { describe, expect, it } from "vitest"
import {
	ELIGIBILITY_DAYS,
	isDonorEligible,
} from "@domain/rules/donorEligibility"
import { Donor } from "@domain/entities/Donor"
import { MS_PER_DAY } from "@domain/utils/dateUtils"

const NOW = new Date("2026-08-26T12:00:00.000Z")
const daysBefore = (n: number) => new Date(NOW.getTime() - n * MS_PER_DAY)

describe("isDonorEligible", () => {
	it("treats a donor who never donated as eligible", () => {
		expect(isDonorEligible("male", null, NOW)).toBe(true)
		expect(isDonorEligible("female", null, NOW)).toBe(true)
	})

	it.each([
		{ sex: "male", days: 59, expected: false },
		{ sex: "male", days: 60, expected: true },
		{ sex: "male", days: 61, expected: true },
		{ sex: "female", days: 89, expected: false },
		{ sex: "female", days: 90, expected: true },
		{ sex: "female", days: 91, expected: true },
	] as const)("$sex donating $days days ago -> eligible=$expected", ({
		sex,
		days,
		expected,
	}) => {
		expect(isDonorEligible(sex, daysBefore(days), NOW)).toBe(expected)
	})

	it("applies a different interval per sex at the same date", () => {
		// 60 days clears the male interval but not the female one.
		const sixtyDaysAgo = daysBefore(60)

		expect(isDonorEligible("male", sixtyDaysAgo, NOW)).toBe(true)
		expect(isDonorEligible("female", sixtyDaysAgo, NOW)).toBe(false)
		expect(ELIGIBILITY_DAYS.female).toBeGreaterThan(ELIGIBILITY_DAYS.male)
	})

	/**
	 * The intervals are the rule the whole system is judged on, so they are pinned to
	 * their literal values. A silent change to either would otherwise only surface as a
	 * shifted boundary somewhere else.
	 */
	it("holds the regulated intervals at 60 days for men and 90 for women", () => {
		expect(ELIGIBILITY_DAYS.male).toBe(60)
		expect(ELIGIBILITY_DAYS.female).toBe(90)
	})

	it("counts whole days only, so a partial day never completes the interval", () => {
		const almostSixty = new Date(NOW.getTime() - (60 * MS_PER_DAY - 1))
		const justOverSixty = new Date(NOW.getTime() - (60 * MS_PER_DAY + 1))

		expect(isDonorEligible("male", almostSixty, NOW)).toBe(false)
		expect(isDonorEligible("male", justOverSixty, NOW)).toBe(true)
	})

	it("keeps a donor who donated today inside the interval", () => {
		expect(isDonorEligible("male", NOW, NOW)).toBe(false)
		expect(isDonorEligible("female", NOW, NOW)).toBe(false)
	})

	/** A donation dated ahead of the clock cannot have completed any interval. */
	it("rejects a donation dated in the future", () => {
		const tomorrow = new Date(NOW.getTime() + MS_PER_DAY)

		expect(isDonorEligible("male", tomorrow, NOW)).toBe(false)
		expect(isDonorEligible("female", tomorrow, NOW)).toBe(false)
	})
})

describe("Donor.isEligible", () => {
	it("delegates to the shared rule", () => {
		const recent = new Donor(
			"1",
			"Recente",
			"male",
			"O+",
			new Date(Date.now() - 1 * MS_PER_DAY),
			"recente@test.dev",
		)
		const never = new Donor("2", "Nunca", "male", "O+", null, "nunca@test.dev")

		expect(recent.isEligible).toBe(false)
		expect(never.isEligible).toBe(true)
	})
})
