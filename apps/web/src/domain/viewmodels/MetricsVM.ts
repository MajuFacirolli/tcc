import type { BloodTypeEnum } from "../enums/BloodTypeEnum"
import type { CampaignKindEnum } from "../enums/CampaignKindEnum"

/**
 * One arm of the generic-vs-segmented comparison. Every rate is already a percentage,
 * scaled from the API's 0–1 ratios.
 */
export interface IMetricsKindSummaryVM {
	kind: CampaignKindEnum
	campaignsCount: number
	notifiedCount: number
	/**
	 * Envios a doadores elegíveis. Counts messages, not people: the same donor
	 * reached by two campaigns is counted twice.
	 */
	eligibleReached: number
	confirmationsCount: number
	/** Confirmations per message sent. */
	conversionRate: number
	/** Confirmations per message that reached someone able to answer. */
	eligibleConversionRate: number
	/**
	 * Precisão do direcionamento: share of messages that reached someone in the
	 * target audience and able to donate.
	 */
	targetingPrecision: number
	/** Seconds. */
	averageResponseTime: number
}

export interface IMetricsBucketVM {
	bucketStart: Date
	notifiedCount: number
	confirmationsCount: number
}

export interface IMetricsVM {
	/** The fixed rolling window every number below describes. */
	windowDays: number
	range: {
		from: Date
		/** Exclusive. */
		to: Date
	}
	/**
	 * The two arms pooled — each field is the sum, or the confirmation-weighted mean,
	 * of the same field on both arms of `comparison`. `eligibleDonorsPool` is the
	 * exception: it is a snapshot of the base right now, so it carries no window.
	 */
	summary: {
		eligibleDonorsPool: number
		campaignsCount: number
		notifiedCount: number
		eligibleReached: number
		confirmationsCount: number
		/** Percentage, already scaled from the API's 0–1 ratio. */
		conversionRate: number
		/** Percentage, already scaled. */
		targetingPrecision: number
		/** Seconds. */
		averageResponseTime: number
	}
	/** One bucket per day of the window, gaps included. */
	series: IMetricsBucketVM[]
	confirmationsByBloodType: {
		bloodType: BloodTypeEnum
		confirmations: number
	}[]
	/**
	 * Generic broadcast against blood-type-and-eligibility segmentation, over the same
	 * window and the same donor base.
	 */
	comparison: {
		generic: IMetricsKindSummaryVM
		segmented: IMetricsKindSummaryVM
		/** How many times better the segmented conversion rate is. */
		conversionLift: number | null
		/** Percentage points of targeting precision the segmentation added. */
		targetingPrecisionGain: number | null
	}
}
