import "reflect-metadata"
import { createBullBoard } from "@bull-board/api"
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter"
import { FastifyAdapter } from "@bull-board/fastify"
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
import { ManyRequestsError } from "@/core/errors/ManyRequestsError"
import { env } from "@/env"
import { queues } from "@infrastructure/queue/queues"
import { AUTH_COOKIE_NAME } from "@presentation/middlewares/authCookie"
import { authenticate } from "@presentation/middlewares/authenticate"
import {
	dashboardBasicAuth,
	resolveDashboardCredentials,
} from "@presentation/middlewares/dashboardAuth"
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

	app.register(fastifyRateLimit, {
		global: false,
		errorResponseBuilder: (_request, context) =>
			new ManyRequestsError(
				new Error(`Muitas requisições. Tente novamente em ${context.after}.`),
			),
	})

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

	const dashboardCredentials = resolveDashboardCredentials()

	if (dashboardCredentials) {
		const bullBoardServerAdapter = new FastifyAdapter()
		bullBoardServerAdapter.setBasePath("/dashboard")
		createBullBoard({
			queues: Object.values(queues).map((queue) => new BullMQAdapter(queue)),
			serverAdapter: bullBoardServerAdapter,
		})

		app.register(async (instance) => {
			instance.addHook("onRequest", dashboardBasicAuth(dashboardCredentials))

			await instance.register(bullBoardServerAdapter.registerPlugin(), {
				prefix: "/dashboard",
			})
		})
	}

	errorHandler(app)

	app.register(registerRoutes)

	return app
}
