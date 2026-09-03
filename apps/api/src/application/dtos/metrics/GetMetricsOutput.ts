import type { BloodType } from "@domain/value_objects/BloodType"
import type { MetricsGranularity } from "@domain/utils/metricsWindow"
import type { MetricsPeriod } from "@domain/value_objects/MetricsPeriod"
import type { CampaignKind } from "@domain/value_objects/CampaignKind"

/**
 * One campaign kind's performance. The three rates share a numerator and differ in
 * denominator, which is what attributes the gap to a cause: `conversionRate` is the
 * bottom line, `eligibleConversionRate` divides the eligibility filter out so what
 * remains is blood-type targeting, and `wastedMessageRate` is the eligibility filter's
 * whole contribution — zero for a segmented campaign by construction.
 */
export type MetricsKindSummary = {
	kind: CampaignKind
	campaignsCount: number
	notifiedCount: number
	/**
	 * Envios a doadores elegíveis: messages that reached someone able to donate.
	 * A count of sends, not of people — a donor notified by three campaigns counts
	 * three times, so this can exceed the size of the donor base.
	 */
	eligibleReached: number
	confirmationsCount: number
	/** Taxa de resposta: confirmations per message sent. */
	conversionRate: number
	eligibleConversionRate: number
	wastedMessages: number
	wastedMessageRate: number
	/**
	 * Precisão do direcionamento: share of messages that reached someone in the
	 * target audience *and* able to donate. The complement of `wastedMessageRate`,
	 * stated positively because it is the quantity the segmentation is meant to move.
	 */
	targetingPrecision: number
	/** Tempo médio de resposta, in seconds. */
	averageResponseTime: number
}

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
		/**
		 * Both arms together, aggregated from the campaign rows rather than the
		 * confirmation rows — `notifiedCount` above counts messages, these count the
		 * campaigns created in the window, so they share a denominator with each other
		 * and not with the fields above.
		 */
		eligibleReached: number
		campaignNotifiedCount: number
		targetingPrecision: number
		deltas: {
			notifiedCount: number
			confirmationsCount: number
			averageResponseTime: number
		}
	}
	series: MetricsBucket[]
	confirmationsByBloodType: {
		bloodType: BloodType
		confirmations: number
	}[]
	/** The experiment's result: broadcast against segmentation, same window and base. */
	comparison: {
		generic: MetricsKindSummary
		segmented: MetricsKindSummary
		/** `null` when an arm sent nothing in the window: no ratio to report. */
		conversionLift: number | null
		wastedMessageRateReduction: number | null
		/** Percentage points of targeting precision the segmentation added. */
		targetingPrecisionGain: number | null
	}
}
