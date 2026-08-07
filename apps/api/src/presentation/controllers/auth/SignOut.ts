import type { FastifyReply, FastifyRequest } from "fastify"
import HttpStatusCode from "@/core/StatusCodesEnum"
import {
	AUTH_COOKIE_NAME,
	authCookieOptions,
} from "@presentation/middlewares/authCookie"

export class SignOutController {
	async handle(_request: FastifyRequest, reply: FastifyReply) {
		return reply
			.clearCookie(AUTH_COOKIE_NAME, authCookieOptions)
			.status(HttpStatusCode.OK)
			.send({
				data: null,
				status: HttpStatusCode.OK,
				message: "Signed out",
			})
	}
}
