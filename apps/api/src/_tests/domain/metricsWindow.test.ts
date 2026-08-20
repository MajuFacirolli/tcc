import { describe, expect, it } from "vitest"
import { percentDelta, resolveMetricsWindow } from "@domain/utils/metricsWindow"

const NOW = new Date("2026-08-20T15:30:00.000Z")

const iso = (date: Date) => date.toISOString()

describe("resolveMetricsWindow", () => {
	it("covers the last 7 whole days for a week", () => {
		const window = resolveMetricsWindow("week", NOW)

		// `to` is exclusive and sits at the next midnight, so today is included.
		expect(iso(window.from)).toBe("2026-08-14T00:00:00.000Z")
		expect(iso(window.to)).toBe("2026-08-21T00:00:00.000Z")
		expect(window.granularity).toBe("day")
		expect(window.bucketCount).toBe(7)
	})

	it("covers the last 30 whole days for a month", () => {
		const window = resolveMetricsWindow("month", NOW)

		expect(iso(window.from)).toBe("2026-07-22T00:00:00.000Z")
		expect(iso(window.to)).toBe("2026-08-21T00:00:00.000Z")
		expect(window.granularity).toBe("day")
		expect(window.bucketCount).toBe(30)
	})

	it("covers 12 months anchored to month starts for a year", () => {
		const window = resolveMetricsWindow("year", NOW)

		// Anchoring to a month start is what keeps the SQL `generate_series` spine
		// stepping onto real month boundaries.
		expect(iso(window.from)).toBe("2025-09-01T00:00:00.000Z")
		expect(iso(window.to)).toBe("2026-09-01T00:00:00.000Z")
		expect(window.granularity).toBe("month")
		expect(window.bucketCount).toBe(12)
	})

	it("makes the previous window immediately precede and match the current one", () => {
		for (const period of ["week", "month", "year"] as const) {
			const window = resolveMetricsWindow(period, NOW)

			expect(iso(window.previousTo)).toBe(iso(window.from))
			expect(window.to.getTime() - window.from.getTime()).toBe(
				window.previousTo.getTime() - window.previousFrom.getTime(),
			)
		}
	})

	it("is stable regardless of the time of day", () => {
		const early = resolveMetricsWindow("week", new Date("2026-08-20T00:00:01Z"))
		const late = resolveMetricsWindow("week", new Date("2026-08-20T23:59:59Z"))

		expect(iso(early.from)).toBe(iso(late.from))
		expect(iso(early.to)).toBe(iso(late.to))
	})
})

describe("percentDelta", () => {
	it("reports the change against the previous window", () => {
		expect(percentDelta(110, 100)).toBeCloseTo(10)
		expect(percentDelta(90, 100)).toBeCloseTo(-10)
		expect(percentDelta(100, 100)).toBe(0)
	})

	it("returns 0 instead of Infinity when there is no baseline", () => {
		expect(percentDelta(50, 0)).toBe(0)
		expect(percentDelta(0, 0)).toBe(0)
	})
})
