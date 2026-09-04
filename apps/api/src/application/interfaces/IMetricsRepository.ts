import type { BloodType } from "@domain/value_objects/BloodType"

/**
 * Every windowed figure below is scoped the same way: by the moment the donor was
 * notified (`confirmations.createdAt`). An intention counts towards the notification
 * that produced it, whenever it arrived, so numerator and denominator always describe
 * the same set of messages — which is what makes the series, the blood-type breakdown
 * and the headline totals reconcile.
 */
export type MetricsTotalsRow = {
	notifications: number
	intentions: number
	/** Seconds. `null` when nothing was answered. */
	averageResponseTime: number | null
}

export type MetricsReachRow = {
	/** Distinct donors who received at least one notification. */
	donorsReached: number
	/** Distinct donors who answered at least one. */
	respondingDonors: number
	/** Donors who answered more than once. */
	repeatResponders: number
}

/**
 * Consecutive notifications to the same donor, paired up. Answering once and then
 * being asked again is the only retention signal the data supports: there is no
 * donation history, only `donors.lastDonationDate`, so a second *donation* cannot be
 * observed — a second *intention* can.
 */
export type MetricsRetentionRow = {
	/** Answered, then notified again. The denominator of the retention rate. */
	answeredThenNotified: number
	/** ...and answered that next one too. */
	answeredAgain: number
	/** Ignored, then notified again. The denominator of the reactivation rate. */
	ignoredThenNotified: number
	/** ...and answered that next one. */
	reactivated: number
}

/** Cumulative: intentions that arrived within `hours` of the notification. */
export type MetricsSpeedRow = {
	hours: number
	intentions: number
}

export type MetricsBloodTypeRow = {
	bloodType: BloodType
	notifications: number
	intentions: number
	bagsCount: number
	minThreshold: number
}

export type MetricsBucketRow = {
	bucketStart: Date
	notifications: number
	intentions: number
}

export type MetricsCampaignRow = {
	id: string
	title: string
	createdAt: Date
	notifications: number
	intentions: number
	/** Seconds. `null` when the campaign drew no answer. */
	averageResponseTime: number | null
}

export type DailyMetricsRow = {
	registeredDonors: number
	eligibleDonors: number
	activeCampaigns: number
	confirmationsToday: number
	notificationsSentToday: number
}

export interface IMetricsRepositoryWindow {
	from: Date
	to: Date
}

export interface IMetricsRepository {
	countEligibleDonors(): Promise<number>
	getTotals(window: IMetricsRepositoryWindow): Promise<MetricsTotalsRow>
	getReach(window: IMetricsRepositoryWindow): Promise<MetricsReachRow>
	getRetention(window: IMetricsRepositoryWindow): Promise<MetricsRetentionRow>
	getResponseSpeed(
		window: IMetricsRepositoryWindow,
		hourCutoffs: readonly number[],
	): Promise<MetricsSpeedRow[]>
	getByBloodType(
		window: IMetricsRepositoryWindow,
	): Promise<MetricsBloodTypeRow[]>
	getBuckets(window: IMetricsRepositoryWindow): Promise<MetricsBucketRow[]>
	getCampaigns(window: IMetricsRepositoryWindow): Promise<MetricsCampaignRow[]>
	getDailyMetrics(window: IMetricsRepositoryWindow): Promise<DailyMetricsRow>
}
