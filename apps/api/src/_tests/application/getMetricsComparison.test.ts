import { describe, expect, it, vi } from "vitest"
import { GetMetricsUseCase } from "@application/use_cases/metrics/GetMetrics"
import type {
	IMetricsRepository,
	MetricsKindRow,
} from "@application/interfaces/IMetricsRepository"

function buildUseCase(byKind: MetricsKindRow[]) {
	const repository: IMetricsRepository = {
		countEligibleDonors: vi.fn().mockResolvedValue(0),
		getWindowTotals: vi.fn().mockResolvedValue({
			current: {
				notifiedCount: 0,
				confirmationsCount: 0,
				averageResponseTime: null,
			},
			previous: {
				notifiedCount: 0,
				confirmationsCount: 0,
				averageResponseTime: null,
			},
		}),
		getBuckets: vi.fn().mockResolvedValue([]),
		getConfirmationsByBloodType: vi.fn().mockResolvedValue([]),
		getComparisonByKind: vi.fn().mockResolvedValue(byKind),
		getDailyMetrics: vi.fn(),
	}

	return new GetMetricsUseCase(repository)
}

const GENERIC: MetricsKindRow = {
	kind: "generic",
	campaignsCount: 7,
	notifiedCount: 1000,
	eligibleReached: 700,
	confirmationsCount: 100,
	averageResponseTime: 21600,
}

const SEGMENTED: MetricsKindRow = {
	kind: "segmented",
	campaignsCount: 7,
	notifiedCount: 200,
	eligibleReached: 200,
	confirmationsCount: 80,
	averageResponseTime: 18000,
}

describe("GetMetricsUseCase comparison", () => {
	it("decomposes each arm over its three denominators", async () => {
		const { comparison } = await buildUseCase([GENERIC, SEGMENTED]).execute({
			period: "week",
		})

		expect(comparison.generic.conversionRate).toBeCloseTo(0.1)
		expect(comparison.generic.eligibleConversionRate).toBeCloseTo(0.1428, 3)
		expect(comparison.generic.wastedMessages).toBe(300)
		expect(comparison.generic.wastedMessageRate).toBeCloseTo(0.3)

		expect(comparison.segmented.conversionRate).toBeCloseTo(0.4)
		expect(comparison.segmented.eligibleConversionRate).toBeCloseTo(0.4)
		expect(comparison.segmented.wastedMessages).toBe(0)
		expect(comparison.segmented.wastedMessageRate).toBe(0)
	})

	it("states targeting precision as the positive side of the wasted rate", async () => {
		const { comparison, summary } = await buildUseCase([
			GENERIC,
			SEGMENTED,
		]).execute({ period: "week" })

		expect(comparison.generic.targetingPrecision).toBeCloseTo(0.7)
		expect(comparison.segmented.targetingPrecision).toBe(1)
		expect(comparison.targetingPrecisionGain).toBeCloseTo(0.3)

		// Both arms pooled: 900 eligible reached out of 1200 messages.
		expect(summary.eligibleReached).toBe(900)
		expect(summary.campaignNotifiedCount).toBe(1200)
		expect(summary.targetingPrecision).toBeCloseTo(0.75)
	})

	it("reports the lift as a ratio of the two conversion rates", async () => {
		const { comparison } = await buildUseCase([GENERIC, SEGMENTED]).execute({
			period: "week",
		})

		expect(comparison.conversionLift).toBeCloseTo(4)
		expect(comparison.wastedMessageRateReduction).toBeCloseTo(0.3)
	})

	/** A window with only one arm cannot support a comparison. */
	it("withholds the lift when an arm sent nothing", async () => {
		const { comparison } = await buildUseCase([SEGMENTED]).execute({
			period: "week",
		})

		expect(comparison.conversionLift).toBeNull()
		expect(comparison.wastedMessageRateReduction).toBeNull()
		expect(comparison.targetingPrecisionGain).toBeNull()
		expect(comparison.generic.campaignsCount).toBe(0)
		expect(comparison.segmented.conversionRate).toBeCloseTo(0.4)
	})

	it("renders a row for each arm even when the window is empty", async () => {
		const { comparison } = await buildUseCase([]).execute({ period: "week" })

		expect(comparison.generic.kind).toBe("generic")
		expect(comparison.segmented.kind).toBe("segmented")
		expect(comparison.conversionLift).toBeNull()
	})
})
