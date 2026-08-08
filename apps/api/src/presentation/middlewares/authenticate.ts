import type { FastifyReply, FastifyRequest } from "fastify"
import fp from "fastify-plugin"
import { UnauthorizedError } from "@/core/errors/UnauthorizedError"

export const authenticate = fp(
	async (app) => {
		app.decorate(
			"authenticate",
			async (request: FastifyRequest, _reply: FastifyReply) => {
				try {
					await request.jwtVerify()
				} catch {
					throw new UnauthorizedError("Authentication required")
				}
			},
		)
	},
	{ name: "authenticate", fastify: "5.x" },
)
