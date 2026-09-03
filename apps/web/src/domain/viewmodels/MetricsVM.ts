import type { BloodTypeEnum } from "../enums/BloodTypeEnum"
import type { CampaignKindEnum } from "../enums/CampaignKindEnum"
import type { MetricsPeriodEnum } from "@/presentation/enums/MetricsPeriodEnum"

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
	wastedMessages: number
	/** Share of messages spent on a donor who could not have confirmed. */
	wastedMessageRate: number
	/**
	 * Precisão do direcionamento: share of messages that reached someone in the
	 * target audience and able to donate. The positive statement of what
	 * `wastedMessageRate` states negatively.
	 */
	targetingPrecision: number
	/** Seconds. */
	averageResponseTime: number
}

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
		/**
		 * Both arms pooled, on the campaign rows' denominator — these three share a
		 * basis with each other, not with `notifiedCount` above.
		 */
		eligibleReached: number
		campaignNotifiedCount: number
		/** Percentage, already scaled. */
		targetingPrecision: number
		/** Percent change against the previous window. */
		deltas: {
			notifiedCount: number
			confirmationsCount: number
			averageResponseTime: number
		}
	}
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
		/** Percentage points of wasted messages the segmentation removed. */
		wastedMessageRateReduction: number | null
		/** Percentage points of targeting precision the segmentation added. */
		targetingPrecisionGain: number | null
	}
}
