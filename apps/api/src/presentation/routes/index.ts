import type { FastifyInstance } from "fastify"
import { auth } from "./auth"
import { campaigns } from "./campaigns"
import { health } from "./health"
import { confirmations } from "./confirmations"
import { metrics } from "./metrics"
import { bloodBank } from "./bloodBank"

export async function registerRoutes(app: FastifyInstance) {
	app.register(health)
	app.register(auth)
	app.register(campaigns)
	app.register(confirmations)
	app.register(metrics)
	app.register(bloodBank)
}
