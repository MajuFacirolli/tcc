import type { FastifyInstance } from "fastify"
import { campaigns } from "./campaigns"
import { health } from "./health"

export async function registerRoutes(app: FastifyInstance) {
	app.register(health)
	app.register(campaigns)
}
