import type { FastifyReply, FastifyRequest } from "fastify"

declare module "fastify" {
	interface FastifyInstance {
		authenticate: (
			request: FastifyRequest,
			reply: FastifyReply,
		) => Promise<void>
	}
}

declare module "@fastify/jwt" {
	interface FastifyJWT {
		payload: { sub: string; email: string }
		user: { sub: string; email: string; iat: number; exp: number }
	}
}
