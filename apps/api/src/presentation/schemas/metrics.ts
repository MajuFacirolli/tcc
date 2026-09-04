import { z } from "zod"
import { bloodTypeSchema } from "./bloodType"
import { campaignKindSchema } from "./campaigns"

const metricsBucketSchema = z.object({
	bucketStart: z.iso.datetime(),
	notifiedCount: z.number(),
	confirmationsCount: z.number(),
})

const metricsKindSummarySchema = z.object({
	kind: campaignKindSchema,
	campaignsCount: z.number(),
	notifiedCount: z.number(),
	eligibleReached: z.number(),
	confirmationsCount: z.number(),
	conversionRate: z.number(),
	eligibleConversionRate: z.number(),
	targetingPrecision: z.number(),
	averageResponseTime: z.number(),
})

export const metricsSchema = z.object({
	windowDays: z.number(),
	range: z.object({
		from: z.iso.datetime(),
		to: z.iso.datetime(),
	}),
	summary: z.object({
		eligibleDonorsPool: z.number(),
		campaignsCount: z.number(),
		notifiedCount: z.number(),
		eligibleReached: z.number(),
		confirmationsCount: z.number(),
		conversionRate: z.number(),
		targetingPrecision: z.number(),
		averageResponseTime: z.number(),
	}),
	series: z.array(metricsBucketSchema),
	confirmationsByBloodType: z.array(
		z.object({
			bloodType: bloodTypeSchema,
			confirmations: z.number(),
		}),
	),
	comparison: z.object({
		generic: metricsKindSummarySchema,
		segmented: metricsKindSummarySchema,
		conversionLift: z.number().nullable(),
		targetingPrecisionGain: z.number().nullable(),
	}),
})

export const dailyMetricsSchema = z.object({
	registeredDonors: z.number(),
	eligibleDonors: z.number(),
	activeCampaigns: z.number(),
	confirmationsToday: z.number(),
	notificationsSentToday: z.number(),
})
