import "reflect-metadata"
import fastifyCors from "@fastify/cors"
import fastifySwagger from "@fastify/swagger"
import ScalarApiReference from "@scalar/fastify-api-reference"
import { fastify } from "fastify"
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod"
import { env } from "@/env"
import { registerRoutes } from "./presentation/routes"

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
	origin: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	// credentials: true,
})

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "HemoConnect API",
			description:
				"API for emergency and strategic mobilization of blood donors",
			version: "1.0.0",
		},
	},
	transform: jsonSchemaTransform,
})

app.register(ScalarApiReference, {
	routePrefix: "/docs",
})

app.register(registerRoutes)

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
	console.log(`🚀 HTTP server running on http://localhost:${env.PORT}`)
	console.log(`📚 Docs available at http://localhost:${env.PORT}/docs`)
})
