import type { GetMetricsInput } from "@/application/dtos/metrics/GetMetricsInput"
import type { GetMetricsOutput } from "@/application/dtos/metrics/GetMetricsOutput"
import type { IMetricsRepository } from "@application/interfaces/IMetricsRepository"
import { CampaignMetrics } from "@domain/entities/CampaignMetrics"
import { percentDelta, resolveMetricsWindow } from "@domain/utils/metricsWindow"

export class GetMetricsUseCase {
	constructor(private readonly metricsRepository: IMetricsRepository) {}

	async execute({ period }: GetMetricsInput): Promise<GetMetricsOutput> {
		const window = resolveMetricsWindow(period)

		const current = { from: window.from, to: window.to }
		const previous = { from: window.previousFrom, to: window.previousTo }

		const [totals, eligibleDonorsPool, eligibleReached, buckets, byBloodType] =
			await Promise.all([
				this.metricsRepository.getWindowTotals(current, previous),
				this.metricsRepository.countEligibleDonors(),
				this.metricsRepository.sumEligibleReached(current),
				this.metricsRepository.getBuckets(current, window.granularity),
				this.metricsRepository.getConfirmationsByBloodType(current),
			])

		const averageResponseTime = totals.current.averageResponseTime ?? 0
		const previousResponseTime = totals.previous.averageResponseTime ?? 0

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
			funnel: {
				eligibleReached,
				notified: totals.current.notifiedCount,
				confirmed: totals.current.confirmationsCount,
			},
			series: buckets.map((bucket) => ({
				bucketStart: bucket.bucketStart.toISOString(),
				notifiedCount: bucket.notifiedCount,
				confirmationsCount: bucket.confirmationsCount,
				averageResponseTime: bucket.averageResponseTime,
			})),
			confirmationsByBloodType: byBloodType,
		}
	}
}
