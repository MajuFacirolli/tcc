import type { BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"
import type { CampaignKindEnum } from "@/domain/enums/CampaignKindEnum"
import type { MetricsPeriodEnum } from "@/presentation/enums/MetricsPeriodEnum"

export interface IMetricsKindSummaryResponse {
	kind: CampaignKindEnum
	campaignsCount: number
	notifiedCount: number
	eligibleReached: number
	confirmationsCount: number
	conversionRate: number
	eligibleConversionRate: number
	wastedMessages: number
	wastedMessageRate: number
	targetingPrecision: number
	averageResponseTime: number
}

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
		eligibleReached: number
		campaignNotifiedCount: number
		targetingPrecision: number
		deltas: {
			notifiedCount: number
			confirmationsCount: number
			averageResponseTime: number
		}
	}
	series: IMetricsBucketResponse[]
	confirmationsByBloodType: {
		bloodType: BloodTypeEnum
		confirmations: number
	}[]
	comparison: {
		generic: IMetricsKindSummaryResponse
		segmented: IMetricsKindSummaryResponse
		conversionLift: number | null
		wastedMessageRateReduction: number | null
		targetingPrecisionGain: number | null
	}
}
