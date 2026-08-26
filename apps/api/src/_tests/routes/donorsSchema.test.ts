import { describe, expect, it } from "vitest"
import { isEligibleQuerySchema } from "@presentation/schemas/donors"

describe("isEligibleQuerySchema", () => {
	it("defaults to null when the param is absent", () => {
		expect(isEligibleQuerySchema.parse(undefined)).toBeNull()
	})

	it.each([
		["true", true],
		["false", false],
	] as const)("parses %s", (input, expected) => {
		expect(isEligibleQuerySchema.parse(input)).toBe(expected)
	})

	it("rejects anything else", () => {
		expect(() => isEligibleQuerySchema.parse("maybe")).toThrow()
	})
})
