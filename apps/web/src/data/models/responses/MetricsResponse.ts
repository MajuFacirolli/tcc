import type { BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"

export interface IMetricsResponse {
	windowDays: number
	range: { from: string; to: string }
	headline: {
		responseRate: number
		averageResponseTime: number
		intentions: number
		retentionRate: number
	}
	reach: {
		notifications: number
		donorsReached: number
		respondingDonors: number
		repeatResponders: number
		eligibleDonorsPool: number
	}
	retention: {
		rate: number
		reactivationRate: number
		answeredThenNotified: number
		ignoredThenNotified: number
	}
	responseSpeed: { hours: number; intentions: number; share: number }[]
	byBloodType: {
		bloodType: BloodTypeEnum
		notifications: number
		intentions: number
		responseRate: number
		bagsCount: number
		minThreshold: number
		stockBalance: number
	}[]
	series: { bucketStart: string; notifications: number; intentions: number }[]
	campaigns: {
		id: string
		title: string
		createdAt: string
		notifications: number
		intentions: number
		responseRate: number
		averageResponseTime: number
	}[]
}
