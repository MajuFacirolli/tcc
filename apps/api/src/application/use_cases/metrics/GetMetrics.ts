import type { GetMetricsInput } from "@/application/dtos/metrics/GetMetricsInput"
import type {
	GetMetricsOutput,
	MetricsKindSummary,
} from "@/application/dtos/metrics/GetMetricsOutput"
import type {
	IMetricsRepository,
	MetricsKindRow,
} from "@application/interfaces/IMetricsRepository"
import { CampaignMetrics } from "@domain/entities/CampaignMetrics"
import { percentDelta, resolveMetricsWindow } from "@domain/utils/metricsWindow"
import type { CampaignKind } from "@domain/value_objects/CampaignKind"

function emptyKindSummary(kind: CampaignKind): MetricsKindSummary {
	return {
		kind,
		campaignsCount: 0,
		notifiedCount: 0,
		eligibleReached: 0,
		confirmationsCount: 0,
		conversionRate: 0,
		eligibleConversionRate: 0,
		wastedMessages: 0,
		wastedMessageRate: 0,
		targetingPrecision: 0,
		averageResponseTime: 0,
	}
}

function toKindSummary(row: MetricsKindRow): MetricsKindSummary {
	const wastedMessages = Math.max(row.notifiedCount - row.eligibleReached, 0)

	return {
		kind: row.kind,
		campaignsCount: row.campaignsCount,
		notifiedCount: row.notifiedCount,
		eligibleReached: row.eligibleReached,
		confirmationsCount: row.confirmationsCount,
		conversionRate: CampaignMetrics.calculateConversionRate(
			row.notifiedCount,
			row.confirmationsCount,
		),
		eligibleConversionRate: CampaignMetrics.calculateConversionRate(
			row.eligibleReached,
			row.confirmationsCount,
		),
		wastedMessages,
		wastedMessageRate:
			row.notifiedCount === 0 ? 0 : wastedMessages / row.notifiedCount,
		targetingPrecision:
			row.notifiedCount === 0 ? 0 : row.eligibleReached / row.notifiedCount,
		averageResponseTime: row.averageResponseTime ?? 0,
	}
}

export class GetMetricsUseCase {
	constructor(private readonly metricsRepository: IMetricsRepository) {}

	async execute({ period }: GetMetricsInput): Promise<GetMetricsOutput> {
		const window = resolveMetricsWindow(period)

		const current = { from: window.from, to: window.to }
		const previous = { from: window.previousFrom, to: window.previousTo }

		const [totals, eligibleDonorsPool, buckets, byBloodType, byKind] =
			await Promise.all([
				this.metricsRepository.getWindowTotals(current, previous),
				this.metricsRepository.countEligibleDonors(),
				this.metricsRepository.getBuckets(current, window.granularity),
				this.metricsRepository.getConfirmationsByBloodType(current),
				this.metricsRepository.getComparisonByKind(current),
			])

		const averageResponseTime = totals.current.averageResponseTime ?? 0
		const previousResponseTime = totals.previous.averageResponseTime ?? 0

		// Both arms together, on the campaign rows' own denominator.
		const campaignNotifiedCount = byKind.reduce(
			(total, row) => total + row.notifiedCount,
			0,
		)
		const eligibleReached = byKind.reduce(
			(total, row) => total + row.eligibleReached,
			0,
		)

		return {
			period,
			granularity: window.granularity,
			range: {
				from: window.from.toISOString(),
				to: window.to.toISOString(),
			},
			summary: {
				eligibleDonorsPool,
				notifiedCount: totals.current.notifiedCount,
				confirmationsCount: totals.current.confirmationsCount,
				conversionRate: CampaignMetrics.calculateConversionRate(
					totals.current.notifiedCount,
					totals.current.confirmationsCount,
				),
				averageResponseTime,
				eligibleReached,
				campaignNotifiedCount,
				targetingPrecision:
					campaignNotifiedCount === 0
						? 0
						: eligibleReached / campaignNotifiedCount,
				deltas: {
					notifiedCount: percentDelta(
						totals.current.notifiedCount,
						totals.previous.notifiedCount,
					),
					confirmationsCount: percentDelta(
						totals.current.confirmationsCount,
						totals.previous.confirmationsCount,
					),
					averageResponseTime: percentDelta(
						averageResponseTime,
						previousResponseTime,
					),
				},
			},
			series: buckets.map((bucket) => ({
				bucketStart: bucket.bucketStart.toISOString(),
				notifiedCount: bucket.notifiedCount,
				confirmationsCount: bucket.confirmationsCount,
				averageResponseTime: bucket.averageResponseTime,
			})),
			confirmationsByBloodType: byBloodType,
			comparison: this.buildComparison(byKind),
		}
	}

	private buildComparison(
		rows: MetricsKindRow[],
	): GetMetricsOutput["comparison"] {
		const byKind = new Map(rows.map((row) => [row.kind, toKindSummary(row)]))

		const generic = byKind.get("generic") ?? emptyKindSummary("generic")
		const segmented = byKind.get("segmented") ?? emptyKindSummary("segmented")

		// A lift needs both sides.
		const comparable = generic.notifiedCount > 0 && segmented.notifiedCount > 0

		return {
			generic,
			segmented,
			conversionLift:
				comparable && generic.conversionRate > 0
					? segmented.conversionRate / generic.conversionRate
					: null,
			wastedMessageRateReduction: comparable
				? generic.wastedMessageRate - segmented.wastedMessageRate
				: null,
			targetingPrecisionGain: comparable
				? segmented.targetingPrecision - generic.targetingPrecision
				: null,
		}
	}
}
