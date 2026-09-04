import type { BloodType } from "@domain/value_objects/BloodType"
import type { CampaignKind } from "@domain/value_objects/CampaignKind"

export type MetricsBucketRow = {
	bucketStart: Date
	notifiedCount: number
	confirmationsCount: number
}

export type DailyMetricsRow = {
	registeredDonors: number
	eligibleDonors: number
	activeCampaigns: number
	confirmationsToday: number
	notificationsSentToday: number
}

/**
 * One campaign kind over the window.
 *
 * Every field describes the same set of rows: the campaigns created in the window and
 * the notifications those campaigns issued. `notifiedCount`, `confirmationsCount` and
 * `averageResponseTime` are counted off the `confirmations` rows rather than read from
 * the denormalised campaign counters, so they cannot drift from the series and the
 * blood-type breakdown, which come from the same rows.
 */
export type MetricsKindRow = {
	kind: CampaignKind
	campaignsCount: number
	notifiedCount: number
	/** Notifications that reached a donor past their waiting interval at send time. */
	eligibleReached: number
	confirmationsCount: number
	/** Seconds, averaged over `confirmationsCount` rows. `null` when there are none. */
	averageResponseTime: number | null
}

export type MetricsBloodTypeRow = {
	bloodType: BloodType
	confirmations: number
}

export interface IMetricsRepositoryWindow {
	from: Date
	to: Date
}

export interface IMetricsRepository {
	countEligibleDonors(): Promise<number>
	getComparisonByKind(
		window: IMetricsRepositoryWindow,
	): Promise<MetricsKindRow[]>
	getBuckets(window: IMetricsRepositoryWindow): Promise<MetricsBucketRow[]>
	getConfirmationsByBloodType(
		window: IMetricsRepositoryWindow,
	): Promise<MetricsBloodTypeRow[]>
	getDailyMetrics(window: IMetricsRepositoryWindow): Promise<DailyMetricsRow>
}
