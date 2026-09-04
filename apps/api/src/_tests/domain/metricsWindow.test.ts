import { describe, expect, it } from "vitest"
import {
	METRICS_WINDOW_DAYS,
	RESPONSE_SPEED_HOURS,
	resolveMetricsWindow,
} from "@domain/utils/metricsWindow"
import { MS_PER_DAY } from "@domain/utils/dateUtils"

const NOW = new Date("2026-09-04T15:30:00.000Z")

const iso = (date: Date) => date.toISOString()

describe("resolveMetricsWindow", () => {
	it("covers the last 30 whole days", () => {
		const window = resolveMetricsWindow(NOW)

		// `to` is exclusive and sits at the next midnight, so today is included.
		expect(iso(window.from)).toBe("2026-08-06T00:00:00.000Z")
		expect(iso(window.to)).toBe("2026-09-05T00:00:00.000Z")
		expect(window.bucketCount).toBe(METRICS_WINDOW_DAYS)
	})

	it("spans exactly one bucket per day", () => {
		const window = resolveMetricsWindow(NOW)

		expect((window.to.getTime() - window.from.getTime()) / MS_PER_DAY).toBe(
			window.bucketCount,
		)
	})

	it("is stable regardless of the time of day", () => {
		const early = resolveMetricsWindow(new Date("2026-09-04T00:00:01Z"))
		const late = resolveMetricsWindow(new Date("2026-09-04T23:59:59Z"))

		expect(iso(early.from)).toBe(iso(late.from))
		expect(iso(early.to)).toBe(iso(late.to))
	})
})

describe("RESPONSE_SPEED_HOURS", () => {
	/** The curve is cumulative, so a cut-off out of order would make it fall. */
	it("rises, so each cut-off contains the one before it", () => {
		expect([...RESPONSE_SPEED_HOURS]).toEqual(
			[...RESPONSE_SPEED_HOURS].sort((a, b) => a - b),
		)
	})
})
