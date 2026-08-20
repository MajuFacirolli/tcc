import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { container } from "@/container/Ioc.config"
import { TYPES } from "@/container/types"
import {
	apiErrorSchema,
	apiResponseSchema,
} from "@presentation/schemas/apiResponse"
import type { GetMetricsController } from "@/presentation/controllers/metrics/GetMetrics"
import { metricsQuerySchema, metricsSchema } from "../schemas/metrics"

export const metrics: FastifyPluginAsyncZod = async (app) => {
	app.addHook("onRequest", app.authenticate)

	const getMetricsController = container.get<GetMetricsController>(
		TYPES.GetMetricsController,
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
}
