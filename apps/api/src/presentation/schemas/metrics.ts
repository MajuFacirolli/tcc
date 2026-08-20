import { METRICS_PERIODS } from "@/domain/value_objects/MetricsPeriod"
import { z } from "zod"
import { bloodTypeSchema } from "./bloodType"

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
		deltas: z.object({
			notifiedCount: z.number(),
			confirmationsCount: z.number(),
			averageResponseTime: z.number(),
		}),
	}),
	funnel: z.object({
		eligibleReached: z.number(),
		notified: z.number(),
		confirmed: z.number(),
	}),
	series: z.array(metricsBucketSchema),
	confirmationsByBloodType: z.array(
		z.object({
			bloodType: bloodTypeSchema,
			confirmations: z.number(),
		}),
	),
})
