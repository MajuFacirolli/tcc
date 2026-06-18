import { fastify } from "fastify"
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod"
import { errorHandler } from "@presentation/middlewares/errorHandler"
import { registerRoutes } from "@presentation/routes"

export function buildTestApp() {
	const app = fastify({ logger: false }).withTypeProvider<ZodTypeProvider>()
	app.setValidatorCompiler(validatorCompiler)
	app.setSerializerCompiler(serializerCompiler)
	// Call directly on root app so the handler applies to all routes.
	// app.register(errorHandler) would scope it to a sibling plugin and routes
	// would fall through to Fastify's default error handler instead.
	errorHandler(app)
	app.register(registerRoutes)
	return app
}
