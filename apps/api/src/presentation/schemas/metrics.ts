import { z } from "zod"
import { bloodTypeSchema } from "./bloodType"

export const metricsSchema = z.object({
	windowDays: z.number(),
	range: z.object({
		from: z.iso.datetime(),
		to: z.iso.datetime(),
	}),
	headline: z.object({
		responseRate: z.number(),
		averageResponseTime: z.number(),
		intentions: z.number(),
		retentionRate: z.number(),
	}),
	reach: z.object({
		notifications: z.number(),
		donorsReached: z.number(),
		respondingDonors: z.number(),
		repeatResponders: z.number(),
		eligibleDonorsPool: z.number(),
	}),
	retention: z.object({
		rate: z.number(),
		reactivationRate: z.number(),
		answeredThenNotified: z.number(),
		ignoredThenNotified: z.number(),
	}),
	responseSpeed: z.array(
		z.object({
			hours: z.number(),
			intentions: z.number(),
			share: z.number(),
		}),
	),
	byBloodType: z.array(
		z.object({
			bloodType: bloodTypeSchema,
			notifications: z.number(),
			intentions: z.number(),
			responseRate: z.number(),
			bagsCount: z.number(),
			minThreshold: z.number(),
			stockBalance: z.number(),
		}),
	),
	series: z.array(
		z.object({
			bucketStart: z.iso.datetime(),
			notifications: z.number(),
			intentions: z.number(),
		}),
	),
	campaigns: z.array(
		z.object({
			id: z.string(),
			title: z.string(),
			createdAt: z.iso.datetime(),
			notifications: z.number(),
			intentions: z.number(),
			responseRate: z.number(),
			averageResponseTime: z.number(),
		}),
	),
})

export const dailyMetricsSchema = z.object({
	registeredDonors: z.number(),
	eligibleDonors: z.number(),
	activeCampaigns: z.number(),
	confirmationsToday: z.number(),
	notificationsSentToday: z.number(),
})
