import type { BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"
import type { MetricsPeriodEnum } from "@/presentation/enums/MetricsPeriodEnum"

export interface IMetricsBucketResponse {
	bucketStart: string
	notifiedCount: number
	confirmationsCount: number
	averageResponseTime: number | null
}

export interface IMetricsResponse {
	period: MetricsPeriodEnum
	granularity: "day" | "month"
	range: {
		from: string
		to: string
	}
	summary: {
		eligibleDonorsPool: number
		notifiedCount: number
		confirmationsCount: number
		conversionRate: number
		averageResponseTime: number
		deltas: {
			notifiedCount: number
			confirmationsCount: number
			averageResponseTime: number
		}
	}
	funnel: {
		eligibleReached: number
		notified: number
		confirmed: number
	}
	series: IMetricsBucketResponse[]
	confirmationsByBloodType: {
		bloodType: BloodTypeEnum
		confirmations: number
	}[]
}
