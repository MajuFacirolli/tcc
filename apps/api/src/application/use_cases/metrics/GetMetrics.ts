import type {
	GetMetricsOutput,
	MetricsKindSummary,
} from "@/application/dtos/metrics/GetMetricsOutput"
import type {
	IMetricsRepository,
	MetricsKindRow,
} from "@application/interfaces/IMetricsRepository"
import { CampaignMetrics } from "@domain/entities/CampaignMetrics"
import {
	METRICS_WINDOW_DAYS,
	resolveMetricsWindow,
} from "@domain/utils/metricsWindow"
import type { CampaignKind } from "@domain/value_objects/CampaignKind"

function emptyKindRow(kind: CampaignKind): MetricsKindRow {
	return {
		kind,
		campaignsCount: 0,
		notifiedCount: 0,
		eligibleReached: 0,
		confirmationsCount: 0,
		averageResponseTime: null,
	}
}

function toKindSummary(row: MetricsKindRow): MetricsKindSummary {
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
		targetingPrecision:
			row.notifiedCount === 0 ? 0 : row.eligibleReached / row.notifiedCount,
		averageResponseTime: row.averageResponseTime ?? 0,
	}
}

/**
 * Each arm's mean covers exactly its own `confirmationsCount` responses, so weighting
 * by that count recovers the mean over both arms exactly. Averaging the two averages
 * would not: it would give a seven-response arm the same weight as a seven-hundred one.
 */
function pooledResponseTime(rows: MetricsKindRow[]): number {
	const confirmations = rows.reduce(
		(total, row) => total + row.confirmationsCount,
		0,
	)

	if (confirmations === 0) return 0

	const seconds = rows.reduce(
		(total, row) =>
			total + (row.averageResponseTime ?? 0) * row.confirmationsCount,
		0,
	)

	return seconds / confirmations
}

export class GetMetricsUseCase {
	constructor(private readonly metricsRepository: IMetricsRepository) {}

	async execute(): Promise<GetMetricsOutput> {
		const window = resolveMetricsWindow()
		const range = { from: window.from, to: window.to }

		const [eligibleDonorsPool, byKind, buckets, byBloodType] =
			await Promise.all([
				this.metricsRepository.countEligibleDonors(),
				this.metricsRepository.getComparisonByKind(range),
				this.metricsRepository.getBuckets(range),
				this.metricsRepository.getConfirmationsByBloodType(range),
			])

		// Both arms, always present, so the payload has a row per arm even when the
		// window holds only one — and so the pooled summary below can never be built
		// from a different set of rows than the comparison.
		const armFor = (kind: CampaignKind) =>
			byKind.find((row) => row.kind === kind) ?? emptyKindRow(kind)

		const arms: [MetricsKindRow, MetricsKindRow] = [
			armFor("generic"),
			armFor("segmented"),
		]

		const sum = (pick: (row: MetricsKindRow) => number) =>
			arms.reduce((total, row) => total + pick(row), 0)

		const notifiedCount = sum((row) => row.notifiedCount)
		const eligibleReached = sum((row) => row.eligibleReached)
		const confirmationsCount = sum((row) => row.confirmationsCount)

		return {
			windowDays: METRICS_WINDOW_DAYS,
			range: {
				from: window.from.toISOString(),
				to: window.to.toISOString(),
			},
			summary: {
				eligibleDonorsPool,
				campaignsCount: sum((row) => row.campaignsCount),
				notifiedCount,
				eligibleReached,
				confirmationsCount,
				conversionRate: CampaignMetrics.calculateConversionRate(
					notifiedCount,
					confirmationsCount,
				),
				targetingPrecision:
					notifiedCount === 0 ? 0 : eligibleReached / notifiedCount,
				averageResponseTime: pooledResponseTime(arms),
			},
			series: buckets.map((bucket) => ({
				bucketStart: bucket.bucketStart.toISOString(),
				notifiedCount: bucket.notifiedCount,
				confirmationsCount: bucket.confirmationsCount,
			})),
			confirmationsByBloodType: byBloodType,
			comparison: this.buildComparison(arms),
		}
	}

	private buildComparison(
		arms: [MetricsKindRow, MetricsKindRow],
	): GetMetricsOutput["comparison"] {
		const [genericRow, segmentedRow] = arms
		const generic = toKindSummary(genericRow)
		const segmented = toKindSummary(segmentedRow)

		// A lift needs both sides.
		const comparable = generic.notifiedCount > 0 && segmented.notifiedCount > 0

		return {
			generic,
			segmented,
			conversionLift:
				comparable && generic.conversionRate > 0
					? segmented.conversionRate / generic.conversionRate
					: null,
			targetingPrecisionGain: comparable
				? segmented.targetingPrecision - generic.targetingPrecision
				: null,
		}
	}
}
