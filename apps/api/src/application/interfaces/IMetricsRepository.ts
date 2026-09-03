import type { BloodType } from "@domain/value_objects/BloodType"
import type { MetricsGranularity } from "@domain/utils/metricsWindow"
import type { CampaignKind } from "@domain/value_objects/CampaignKind"

export type MetricsWindowTotals = {
	notifiedCount: number
	confirmationsCount: number
	averageResponseTime: number | null
}

export type MetricsBucketRow = {
	bucketStart: Date
	notifiedCount: number
	confirmationsCount: number
	averageResponseTime: number | null
}

export type DailyMetricsRow = {
	registeredDonors: number
	eligibleDonors: number
	activeCampaigns: number
	confirmationsToday: number
	notificationsSentToday: number
}

/**
 * One campaign kind over the window, aggregated from the campaign rows so every count
 * describes the same set of campaigns: those created in the window.
 */
export type MetricsKindRow = {
	kind: CampaignKind
	campaignsCount: number
	notifiedCount: number
	eligibleReached: number
	confirmationsCount: number
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
	getWindowTotals(
		current: IMetricsRepositoryWindow,
		previous: IMetricsRepositoryWindow,
	): Promise<{ current: MetricsWindowTotals; previous: MetricsWindowTotals }>
	getBuckets(
		window: IMetricsRepositoryWindow,
		granularity: MetricsGranularity,
	): Promise<MetricsBucketRow[]>
	getConfirmationsByBloodType(
		window: IMetricsRepositoryWindow,
	): Promise<MetricsBloodTypeRow[]>
	getComparisonByKind(
		window: IMetricsRepositoryWindow,
	): Promise<MetricsKindRow[]>
	getDailyMetrics(window: IMetricsRepositoryWindow): Promise<DailyMetricsRow>
}
