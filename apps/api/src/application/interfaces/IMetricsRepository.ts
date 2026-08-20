import type { BloodType } from "@domain/value_objects/BloodType"
import type { MetricsGranularity } from "@domain/utils/metricsWindow"

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
	sumEligibleReached(window: IMetricsRepositoryWindow): Promise<number>
	getBuckets(
		window: IMetricsRepositoryWindow,
		granularity: MetricsGranularity,
	): Promise<MetricsBucketRow[]>
	getConfirmationsByBloodType(
		window: IMetricsRepositoryWindow,
	): Promise<MetricsBloodTypeRow[]>
}
