import type { BloodType } from "@domain/value_objects/BloodType"

/**
 * The four numbers the page leads with. Rates are 0–1; durations are seconds.
 */
export type MetricsHeadline = {
	/** Intentions per notification sent. */
	responseRate: number
	/** How long an answer takes, on average. */
	averageResponseTime: number
	/** Intentions registered in the window. */
	intentions: number
	/**
	 * Of the donors who answered and were asked again, the share who answered again.
	 * Response retention — not donation retention, which the schema cannot express.
	 */
	retentionRate: number
}

export type MetricsReach = {
	notifications: number
	donorsReached: number
	respondingDonors: number
	repeatResponders: number
	/** Donors able to donate right now. A snapshot; belongs to no window. */
	eligibleDonorsPool: number
}

export type MetricsRetention = {
	rate: number
	/** Of the donors who ignored and were asked again, the share who answered. */
	reactivationRate: number
	answeredThenNotified: number
	ignoredThenNotified: number
}

/** Cumulative share of intentions that had arrived by `hours` after the send. */
export type MetricsSpeedPoint = {
	hours: number
	intentions: number
	share: number
}

export type MetricsBloodTypePoint = {
	bloodType: BloodType
	notifications: number
	intentions: number
	responseRate: number
	bagsCount: number
	minThreshold: number
	/** Bags above the safety minimum; negative when the type is short. */
	stockBalance: number
}

export type MetricsBucket = {
	bucketStart: string
	notifications: number
	intentions: number
}

export type MetricsCampaign = {
	id: string
	title: string
	createdAt: string
	notifications: number
	intentions: number
	responseRate: number
	averageResponseTime: number
}

export type GetMetricsOutput = {
	/** The fixed rolling window every figure below describes. */
	windowDays: number
	range: {
		from: string
		/** Exclusive. */
		to: string
	}
	headline: MetricsHeadline
	reach: MetricsReach
	retention: MetricsRetention
	responseSpeed: MetricsSpeedPoint[]
	/** One entry per blood type the bank tracks, short types first. */
	byBloodType: MetricsBloodTypePoint[]
	/** One bucket per day of the window, silent days included. */
	series: MetricsBucket[]
	/** Campaigns created in the window, newest first. */
	campaigns: MetricsCampaign[]
}
