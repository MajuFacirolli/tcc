import type { BloodType } from "@domain/value_objects/BloodType"
import type { CampaignKind } from "@domain/value_objects/CampaignKind"

/**
 * One campaign kind's performance. The two conversion rates share a numerator and
 * differ in denominator, which is what attributes the gap to a cause: `conversionRate`
 * is the bottom line, and `eligibleConversionRate` divides the eligibility filter out
 * so what remains is blood-type targeting. `targetingPrecision` is that filter's whole
 * contribution — 100% for a segmented campaign by construction.
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
	/**
	 * Precisão do direcionamento: share of messages that reached someone in the
	 * target audience *and* able to donate — the quantity the segmentation exists
	 * to move.
	 */
	targetingPrecision: number
	/** Tempo médio de resposta, in seconds. */
	averageResponseTime: number
}

export type MetricsBucket = {
	bucketStart: string
	notifiedCount: number
	confirmationsCount: number
}

export type GetMetricsOutput = {
	/** The fixed rolling window the whole payload describes. */
	windowDays: number
	range: {
		from: string
		/** Exclusive. */
		to: string
	}
	/**
	 * The two arms pooled. Every field here is the sum (or the weighted mean) of the
	 * matching field on `comparison.generic` and `comparison.segmented`, so the summary,
	 * the table, the series and the blood-type breakdown all rest on one set of rows.
	 * `eligibleDonorsPool` is the exception: it is a snapshot of the base right now and
	 * belongs to no window.
	 */
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
	/** One bucket per day of the window, gaps included. */
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
		/** Percentage points of targeting precision the segmentation added. */
		targetingPrecisionGain: number | null
	}
}
