import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

export const health: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/api/health",
		{
			schema: {
				summary: "API health check",
				response: {
					200: z.object({
						status: z.string(),
						timestamp: z.string(),
					}),
				},
			},
		},
		async () => {
			return {
				status: "healthy",
				timestamp: new Date().toISOString(),
			}
		},
	)
}
