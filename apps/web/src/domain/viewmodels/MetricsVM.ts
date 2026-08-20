import type { BloodTypeEnum } from "../enums/BloodTypeEnum"
import type { MetricsPeriodEnum } from "@/presentation/enums/MetricsPeriodEnum"

export interface IMetricsBucketVM {
	bucketStart: Date
	notifiedCount: number
	confirmationsCount: number
	/** Seconds. `null` when nothing was confirmed in the bucket. */
	averageResponseTime: number | null
}

export interface IMetricsVM {
	period: MetricsPeriodEnum
	granularity: "day" | "month"
	range: {
		from: Date
		to: Date
	}
	summary: {
		/** Donors eligible right now. Has no history, so it carries no delta. */
		eligibleDonorsPool: number
		notifiedCount: number
		confirmationsCount: number
		/** Percentage, already scaled from the API's 0–1 ratio. */
		conversionRate: number
		/** Seconds. */
		averageResponseTime: number
		/** Percent change against the previous window. */
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
	series: IMetricsBucketVM[]
	confirmationsByBloodType: {
		bloodType: BloodTypeEnum
		confirmations: number
	}[]
}
