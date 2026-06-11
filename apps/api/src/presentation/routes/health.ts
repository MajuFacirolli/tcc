import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { apiResponseSchema } from "@presentation/schemas/apiResponse"

export const health: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/api/health",
		{
			schema: {
				summary: "API health check",
				response: {
					200: apiResponseSchema(z.object({ timestamp: z.string() })),
				},
			},
		},
		async (_request, reply) => {
			return reply.status(200).send({
				data: {
					timestamp: new Date().toISOString(),
				},
				status: 200,
				message: "Healthy",
			})
		},
	)
}
