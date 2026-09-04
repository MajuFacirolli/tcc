import type { GetMetricsOutput } from "@/application/dtos/metrics/GetMetricsOutput"
import type { IMetricsRepository } from "@application/interfaces/IMetricsRepository"
import { CampaignMetrics } from "@domain/entities/CampaignMetrics"
import {
	METRICS_WINDOW_DAYS,
	RESPONSE_SPEED_HOURS,
	resolveMetricsWindow,
} from "@domain/utils/metricsWindow"

function share(part: number, whole: number): number {
	return whole === 0 ? 0 : part / whole
}

export class GetMetricsUseCase {
	constructor(private readonly metricsRepository: IMetricsRepository) {}

	async execute(): Promise<GetMetricsOutput> {
		const window = resolveMetricsWindow()
		const range = { from: window.from, to: window.to }

		const [
			eligibleDonorsPool,
			totals,
			reach,
			retention,
			speed,
			byBloodType,
			buckets,
			campaigns,
		] = await Promise.all([
			this.metricsRepository.countEligibleDonors(),
			this.metricsRepository.getTotals(range),
			this.metricsRepository.getReach(range),
			this.metricsRepository.getRetention(range),
			this.metricsRepository.getResponseSpeed(range, RESPONSE_SPEED_HOURS),
			this.metricsRepository.getByBloodType(range),
			this.metricsRepository.getBuckets(range),
			this.metricsRepository.getCampaigns(range),
		])

		const retentionRate = share(
			retention.answeredAgain,
			retention.answeredThenNotified,
		)

		return {
			windowDays: METRICS_WINDOW_DAYS,
			range: {
				from: window.from.toISOString(),
				to: window.to.toISOString(),
			},
			headline: {
				responseRate: CampaignMetrics.calculateConversionRate(
					totals.notifications,
					totals.intentions,
				),
				averageResponseTime: totals.averageResponseTime ?? 0,
				intentions: totals.intentions,
				retentionRate,
			},
			reach: {
				notifications: totals.notifications,
				donorsReached: reach.donorsReached,
				respondingDonors: reach.respondingDonors,
				repeatResponders: reach.repeatResponders,
				eligibleDonorsPool,
			},
			retention: {
				rate: retentionRate,
				reactivationRate: share(
					retention.reactivated,
					retention.ignoredThenNotified,
				),
				answeredThenNotified: retention.answeredThenNotified,
				ignoredThenNotified: retention.ignoredThenNotified,
			},
			responseSpeed: speed.map((point) => ({
				hours: point.hours,
				intentions: point.intentions,
				share: share(point.intentions, totals.intentions),
			})),
			// Shortest stock first: the type that needs a campaign is the one to read.
			byBloodType: byBloodType
				.map((row) => ({
					bloodType: row.bloodType,
					notifications: row.notifications,
					intentions: row.intentions,
					responseRate: CampaignMetrics.calculateConversionRate(
						row.notifications,
						row.intentions,
					),
					bagsCount: row.bagsCount,
					minThreshold: row.minThreshold,
					stockBalance: row.bagsCount - row.minThreshold,
				}))
				.sort((a, b) => a.stockBalance - b.stockBalance),
			series: buckets.map((bucket) => ({
				bucketStart: bucket.bucketStart.toISOString(),
				notifications: bucket.notifications,
				intentions: bucket.intentions,
			})),
			campaigns: campaigns.map((campaign) => ({
				id: campaign.id,
				title: campaign.title,
				createdAt: campaign.createdAt.toISOString(),
				notifications: campaign.notifications,
				intentions: campaign.intentions,
				responseRate: CampaignMetrics.calculateConversionRate(
					campaign.notifications,
					campaign.intentions,
				),
				averageResponseTime: campaign.averageResponseTime ?? 0,
			})),
		}
	}
}
