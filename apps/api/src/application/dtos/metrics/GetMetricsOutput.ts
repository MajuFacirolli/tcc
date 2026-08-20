import type { BloodType } from "@domain/value_objects/BloodType"
import type { MetricsGranularity } from "@domain/utils/metricsWindow"
import type { MetricsPeriod } from "@domain/value_objects/MetricsPeriod"

export type MetricsBucket = {
	bucketStart: string
	notifiedCount: number
	confirmationsCount: number
	averageResponseTime: number | null
}

export type GetMetricsOutput = {
	period: MetricsPeriod
	granularity: MetricsGranularity
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
	series: MetricsBucket[]
	confirmationsByBloodType: {
		bloodType: BloodType
		confirmations: number
	}[]
}
