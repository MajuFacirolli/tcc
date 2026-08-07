import "reflect-metadata"
import fastifyCookie from "@fastify/cookie"
import fastifyCors from "@fastify/cors"
import fastifyJwt from "@fastify/jwt"
import fastifyRateLimit from "@fastify/rate-limit"
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
import { AUTH_COOKIE_NAME } from "@presentation/middlewares/authCookie"
import { authenticate } from "@presentation/middlewares/authenticate"
import { errorHandler } from "@presentation/middlewares/errorHandler"
import { registerRoutes } from "@presentation/routes"

export function buildApp() {
	const app = fastify().withTypeProvider<ZodTypeProvider>()

	app.setValidatorCompiler(validatorCompiler)
	app.setSerializerCompiler(serializerCompiler)

	app.register(fastifyCookie)

	app.register(fastifyJwt, {
		secret: env.JWT_SECRET,
		cookie: {
			cookieName: AUTH_COOKIE_NAME,
			signed: false,
		},
		sign: {
			expiresIn: env.SESSION_DURATION,
		},
		verify: {
			onlyCookie: true,
		},
	})

	app.register(fastifyCors, {
		origin: env.WEB_ORIGIN,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		credentials: true,
	})

	app.register(fastifyRateLimit, { global: false })

	app.register(fastifySwagger, {
		openapi: {
			info: {
				title: "HemoConnect API",
				description:
					"API for emergency and strategic mobilization of blood donors",
				version: "1.0.0",
			},
			components: {
				securitySchemes: {
					cookieAuth: {
						type: "apiKey",
						in: "cookie",
						name: AUTH_COOKIE_NAME,
					},
				},
			},
		},
		transform: jsonSchemaTransform,
	})

	app.register(ScalarApiReference, { routePrefix: "/docs" })

	app.register(authenticate)

	errorHandler(app)

	app.register(registerRoutes)

	return app
}
