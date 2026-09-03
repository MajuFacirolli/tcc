import { METRICS_PERIODS } from "@/domain/value_objects/MetricsPeriod"
import { z } from "zod"
import { bloodTypeSchema } from "./bloodType"
import { campaignKindSchema } from "./campaigns"

export const metricsPeriodSchema = z.enum(
	METRICS_PERIODS,
	"Informe um período válido",
)

export const metricsQuerySchema = z.object({
	period: metricsPeriodSchema.default("week"),
})

const metricsBucketSchema = z.object({
	bucketStart: z.iso.datetime(),
	notifiedCount: z.number(),
	confirmationsCount: z.number(),
	averageResponseTime: z.number().nullable(),
})

const metricsKindSummarySchema = z.object({
	kind: campaignKindSchema,
	campaignsCount: z.number(),
	notifiedCount: z.number(),
	eligibleReached: z.number(),
	confirmationsCount: z.number(),
	conversionRate: z.number(),
	eligibleConversionRate: z.number(),
	wastedMessages: z.number(),
	wastedMessageRate: z.number(),
	targetingPrecision: z.number(),
	averageResponseTime: z.number(),
})

export const metricsSchema = z.object({
	period: metricsPeriodSchema,
	granularity: z.enum(["day", "month"]),
	range: z.object({
		from: z.iso.datetime(),
		to: z.iso.datetime(),
	}),
	summary: z.object({
		eligibleDonorsPool: z.number(),
		notifiedCount: z.number(),
		confirmationsCount: z.number(),
		conversionRate: z.number(),
		averageResponseTime: z.number(),
		eligibleReached: z.number(),
		campaignNotifiedCount: z.number(),
		targetingPrecision: z.number(),
		deltas: z.object({
			notifiedCount: z.number(),
			confirmationsCount: z.number(),
			averageResponseTime: z.number(),
		}),
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
		wastedMessageRateReduction: z.number().nullable(),
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
