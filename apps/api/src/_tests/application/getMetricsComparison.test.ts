import { describe, expect, it, vi } from "vitest"
import { GetMetricsUseCase } from "@application/use_cases/metrics/GetMetrics"
import type {
	IMetricsRepository,
	MetricsKindRow,
} from "@application/interfaces/IMetricsRepository"

function buildUseCase(
	byKind: MetricsKindRow[],
	overrides: Partial<IMetricsRepository> = {},
) {
	const repository: IMetricsRepository = {
		countEligibleDonors: vi.fn().mockResolvedValue(0),
		getBuckets: vi.fn().mockResolvedValue([]),
		getConfirmationsByBloodType: vi.fn().mockResolvedValue([]),
		getComparisonByKind: vi.fn().mockResolvedValue(byKind),
		getDailyMetrics: vi.fn(),
		...overrides,
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
	/** The two rates differ only in denominator, which is what isolates each cause. */
	it("decomposes each arm over both of its denominators", async () => {
		const { comparison } = await buildUseCase([GENERIC, SEGMENTED]).execute()

		expect(comparison.generic.conversionRate).toBeCloseTo(0.1)
		expect(comparison.generic.eligibleConversionRate).toBeCloseTo(0.1428, 3)

		// Every message in the segmented arm reached an eligible donor, so the two
		// denominators coincide and the rates with them.
		expect(comparison.segmented.conversionRate).toBeCloseTo(0.4)
		expect(comparison.segmented.eligibleConversionRate).toBeCloseTo(0.4)
	})

	it("states targeting precision as the share of messages that landed well", async () => {
		const { comparison } = await buildUseCase([GENERIC, SEGMENTED]).execute()

		expect(comparison.generic.targetingPrecision).toBeCloseTo(0.7)
		expect(comparison.segmented.targetingPrecision).toBe(1)
		expect(comparison.targetingPrecisionGain).toBeCloseTo(0.3)
	})

	it("reports the lift as a ratio of the two conversion rates", async () => {
		const { comparison } = await buildUseCase([GENERIC, SEGMENTED]).execute()

		expect(comparison.conversionLift).toBeCloseTo(4)
	})

	/** A window with only one arm cannot support a comparison. */
	it("withholds the lift when an arm sent nothing", async () => {
		const { comparison } = await buildUseCase([SEGMENTED]).execute()

		expect(comparison.conversionLift).toBeNull()
		expect(comparison.targetingPrecisionGain).toBeNull()
		expect(comparison.generic.campaignsCount).toBe(0)
		expect(comparison.segmented.conversionRate).toBeCloseTo(0.4)
	})

	it("renders a row for each arm even when the window is empty", async () => {
		const { comparison } = await buildUseCase([]).execute()

		expect(comparison.generic.kind).toBe("generic")
		expect(comparison.segmented.kind).toBe("segmented")
		expect(comparison.conversionLift).toBeNull()
	})
})

describe("GetMetricsUseCase summary", () => {
	it("pools the two arms, so the summary always reconciles with the table", async () => {
		const { summary, comparison } = await buildUseCase([
			GENERIC,
			SEGMENTED,
		]).execute()

		expect(summary.campaignsCount).toBe(14)
		expect(summary.notifiedCount).toBe(
			comparison.generic.notifiedCount + comparison.segmented.notifiedCount,
		)
		expect(summary.confirmationsCount).toBe(
			comparison.generic.confirmationsCount +
				comparison.segmented.confirmationsCount,
		)
		expect(summary.eligibleReached).toBe(900)
		expect(summary.conversionRate).toBeCloseTo(180 / 1200)
		expect(summary.targetingPrecision).toBeCloseTo(0.75)
	})

	/** Averaging the two averages would over-weight the smaller arm. */
	it("weights the pooled response time by each arm's confirmations", async () => {
		const { summary } = await buildUseCase([GENERIC, SEGMENTED]).execute()

		expect(summary.averageResponseTime).toBeCloseTo(
			(21600 * 100 + 18000 * 80) / 180,
		)
	})

	it("reports no response time when nothing was confirmed", async () => {
		const { summary } = await buildUseCase([
			{ ...GENERIC, confirmationsCount: 0, averageResponseTime: null },
		]).execute()

		expect(summary.averageResponseTime).toBe(0)
	})

	it("makes the daily series add up to the confirmations total", async () => {
		const series = [
			{
				bucketStart: new Date("2026-08-19T00:00:00Z"),
				notifiedCount: 700,
				confirmationsCount: 100,
			},
			{
				bucketStart: new Date("2026-08-20T00:00:00Z"),
				notifiedCount: 500,
				confirmationsCount: 80,
			},
		]

		const { summary, series: output } = await buildUseCase(
			[GENERIC, SEGMENTED],
			{ getBuckets: vi.fn().mockResolvedValue(series) },
		).execute()

		const total = output.reduce(
			(sum, bucket) => sum + bucket.confirmationsCount,
			0,
		)

		expect(total).toBe(summary.confirmationsCount)
	})
})
