import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { container } from "@/container/Ioc.config"
import { TYPES } from "@/container/types"
import {
	apiErrorSchema,
	apiResponseSchema,
} from "@presentation/schemas/apiResponse"
import type { SignInController } from "@/presentation/controllers/auth/SignIn"
import type { SignOutController } from "@/presentation/controllers/auth/SignOut"
import type { GetProfileController } from "@/presentation/controllers/auth/GetProfile"
import { authUserSchema, signInBodySchema } from "../schemas/auth"

export const auth: FastifyPluginAsyncZod = async (app) => {
	const signInController = container.get<SignInController>(
		TYPES.SignInController,
	)
	const signOutController = container.get<SignOutController>(
		TYPES.SignOutController,
	)
	const getProfileController = container.get<GetProfileController>(
		TYPES.GetProfileController,
	)

	app.post(
		"/api/auth/sign-in",
		{
			config: { rateLimit: { max: 10, timeWindow: "1 minute" } },
			schema: {
				summary: "Sign in",
				tags: ["Auth"],
				body: signInBodySchema,
				response: {
					200: apiResponseSchema(authUserSchema),
					401: apiErrorSchema,
					429: apiErrorSchema,
				},
			},
		},
		(req, rep) => signInController.handle(req, rep),
	)

	app.post(
		"/api/auth/sign-out",
		{
			schema: {
				summary: "Sign out",
				tags: ["Auth"],
				response: { 200: apiResponseSchema(z.null()) },
			},
		},
		(req, rep) => signOutController.handle(req, rep),
	)

	app.get(
		"/api/auth/profile",
		{
			onRequest: app.authenticate,
			schema: {
				summary: "Profile",
				tags: ["Auth"],
				security: [{ cookieAuth: [] }],
				response: {
					200: apiResponseSchema(authUserSchema),
					401: apiErrorSchema,
				},
			},
		},
		(req, rep) => getProfileController.handle(req, rep),
	)
}
