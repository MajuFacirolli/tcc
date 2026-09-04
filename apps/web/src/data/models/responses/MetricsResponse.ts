import type { BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"
import type { CampaignKindEnum } from "@/domain/enums/CampaignKindEnum"

export interface IMetricsKindSummaryResponse {
	kind: CampaignKindEnum
	campaignsCount: number
	notifiedCount: number
	eligibleReached: number
	confirmationsCount: number
	conversionRate: number
	eligibleConversionRate: number
	targetingPrecision: number
	averageResponseTime: number
}

export interface IMetricsBucketResponse {
	bucketStart: string
	notifiedCount: number
	confirmationsCount: number
}

export interface IMetricsResponse {
	windowDays: number
	range: {
		from: string
		to: string
	}
	summary: {
		eligibleDonorsPool: number
		campaignsCount: number
		notifiedCount: number
		eligibleReached: number
		confirmationsCount: number
		conversionRate: number
		targetingPrecision: number
		averageResponseTime: number
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
		targetingPrecisionGain: number | null
	}
}
