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
