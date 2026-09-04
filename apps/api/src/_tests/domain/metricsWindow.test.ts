import { describe, expect, it } from "vitest"
import {
	METRICS_WINDOW_DAYS,
	resolveMetricsWindow,
} from "@domain/utils/metricsWindow"

const NOW = new Date("2026-08-20T15:30:00.000Z")

const iso = (date: Date) => date.toISOString()

describe("resolveMetricsWindow", () => {
	it("covers the last 30 whole days", () => {
		const window = resolveMetricsWindow(NOW)

		// `to` is exclusive and sits at the next midnight, so today is included.
		expect(iso(window.from)).toBe("2026-07-22T00:00:00.000Z")
		expect(iso(window.to)).toBe("2026-08-21T00:00:00.000Z")
		expect(window.bucketCount).toBe(METRICS_WINDOW_DAYS)
	})

	it("spans exactly one bucket per day", () => {
		const window = resolveMetricsWindow(NOW)
		const days =
			(window.to.getTime() - window.from.getTime()) / (24 * 60 * 60 * 1000)

		expect(days).toBe(window.bucketCount)
	})

	it("is stable regardless of the time of day", () => {
		const early = resolveMetricsWindow(new Date("2026-08-20T00:00:01Z"))
		const late = resolveMetricsWindow(new Date("2026-08-20T23:59:59Z"))

		expect(iso(early.from)).toBe(iso(late.from))
		expect(iso(early.to)).toBe(iso(late.to))
	})
})
