import type { BloodTypeEnum } from "../enums/BloodTypeEnum"

/** Every rate here is already a percentage, scaled from the API's 0–1 ratios. */
export interface IMetricsHeadlineVM {
	responseRate: number
	/** Seconds. */
	averageResponseTime: number
	intentions: number
	retentionRate: number
}

export interface IMetricsReachVM {
	notifications: number
	donorsReached: number
	respondingDonors: number
	repeatResponders: number
	/** Donors able to donate right now. A snapshot; belongs to no window. */
	eligibleDonorsPool: number
}

export interface IMetricsRetentionVM {
	/** Answered, asked again, answered again. */
	rate: number
	/** Ignored, asked again, answered. */
	reactivationRate: number
	answeredThenNotified: number
	ignoredThenNotified: number
}

export interface IMetricsSpeedPointVM {
	hours: number
	intentions: number
	/** Cumulative percentage of everything answered. */
	share: number
}

export interface IMetricsBloodTypeVM {
	bloodType: BloodTypeEnum
	notifications: number
	intentions: number
	responseRate: number
	bagsCount: number
	minThreshold: number
	/** Bags above the safety minimum; negative when the type is short. */
	stockBalance: number
}

export interface IMetricsBucketVM {
	bucketStart: Date
	notifications: number
	intentions: number
}

export interface IMetricsCampaignVM {
	id: string
	title: string
	createdAt: Date
	notifications: number
	intentions: number
	responseRate: number
	/** Seconds. */
	averageResponseTime: number
}

export interface IMetricsVM {
	windowDays: number
	range: { from: Date; to: Date }
	headline: IMetricsHeadlineVM
	reach: IMetricsReachVM
	retention: IMetricsRetentionVM
	responseSpeed: IMetricsSpeedPointVM[]
	/** Shortest stock first. */
	byBloodType: IMetricsBloodTypeVM[]
	series: IMetricsBucketVM[]
	campaigns: IMetricsCampaignVM[]
}
