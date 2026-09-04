import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { container } from "@/container/Ioc.config"
import { TYPES } from "@/container/types"
import {
	apiErrorSchema,
	apiResponseSchema,
} from "@presentation/schemas/apiResponse"
import type { GetMetricsController } from "@/presentation/controllers/metrics/GetMetrics"
import type { GetDailyMetricsController } from "@/presentation/controllers/metrics/GetDailyMetrics"
import { dailyMetricsSchema, metricsSchema } from "../schemas/metrics"

export const metrics: FastifyPluginAsyncZod = async (app) => {
	app.addHook("onRequest", app.authenticate)

	const getMetricsController = container.get<GetMetricsController>(
		TYPES.GetMetricsController,
	)

	const getDailyMetricsController = container.get<GetDailyMetricsController>(
		TYPES.GetDailyMetricsController,
	)

	app.get(
		"/api/metrics",
		{
			schema: {
				summary: "Get decision metrics for the last 30 days",
				tags: ["Metrics"],
				security: [{ cookieAuth: [] }],
				response: {
					200: apiResponseSchema(metricsSchema),
					401: apiErrorSchema,
				},
			},
		},
		(_req, rep) => getMetricsController.handle(rep),
	)

	app.get(
		"/api/metrics/daily",
		{
			schema: {
				summary: "Get today's dashboard indicators",
				tags: ["Metrics"],
				security: [{ cookieAuth: [] }],
				response: {
					200: apiResponseSchema(dailyMetricsSchema),
					401: apiErrorSchema,
				},
			},
		},
		(req, rep) => getDailyMetricsController.handle(req, rep),
	)
}
