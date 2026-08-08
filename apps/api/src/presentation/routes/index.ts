import type { FastifyInstance } from "fastify"
import { auth } from "./auth"
import { campaigns } from "./campaigns"
import { health } from "./health"

export async function registerRoutes(app: FastifyInstance) {
	app.register(health)
	app.register(auth)
	app.register(campaigns)
}
