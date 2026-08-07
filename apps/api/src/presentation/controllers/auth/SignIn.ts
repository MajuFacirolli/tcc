import type { FastifyReply } from "fastify"
import HttpStatusCode from "@/core/StatusCodesEnum"
import type { SignInUseCase } from "@application/use_cases/auth/SignIn"
import {
	AUTH_COOKIE_NAME,
	authCookieOptions,
} from "@presentation/middlewares/authCookie"
import type { SignInInput } from "@/application/dtos/auth/SignInInput"

export class SignInController {
	constructor(private readonly signInUseCase: SignInUseCase) {}

	async handle(request: { body: SignInInput }, reply: FastifyReply) {
		const user = await this.signInUseCase.execute(request.body)

		const token = await reply.jwtSign({ sub: user.id, email: user.email })

		return reply
			.setCookie(AUTH_COOKIE_NAME, token, authCookieOptions)
			.status(HttpStatusCode.OK)
			.send({
				data: {
					id: user.id,
					name: user.name,
					email: user.email,
				},
				status: HttpStatusCode.OK,
				message: "Signed in",
			})
	}
}
