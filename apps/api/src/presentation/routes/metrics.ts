import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { container } from "@/container/Ioc.config"
import { TYPES } from "@/container/types"
import {
	apiErrorSchema,
	apiResponseSchema,
} from "@presentation/schemas/apiResponse"
import type { GetMetricsController } from "@/presentation/controllers/metrics/GetMetrics"
import type { GetDailyMetricsController } from "@/presentation/controllers/metrics/GetDailyMetrics"
import {
	dailyMetricsSchema,
	metricsQuerySchema,
	metricsSchema,
} from "../schemas/metrics"

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
				summary: "Get campaign metrics for a rolling period",
				tags: ["Metrics"],
				security: [{ cookieAuth: [] }],
				querystring: metricsQuerySchema,
				response: {
					200: apiResponseSchema(metricsSchema),
					400: apiErrorSchema,
					401: apiErrorSchema,
				},
			},
		},
		(req, rep) => getMetricsController.handle(req, rep),
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
