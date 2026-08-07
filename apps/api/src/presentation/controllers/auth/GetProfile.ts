import type { FastifyReply, FastifyRequest } from "fastify"
import { UnauthorizedError } from "@/core/errors/UnauthorizedError"
import HttpStatusCode from "@/core/StatusCodesEnum"
import type { GetProfileUseCase } from "@application/use_cases/auth/GetProfile"

export class GetProfileController {
	constructor(private readonly getProfileUseCase: GetProfileUseCase) {}

	async handle(request: FastifyRequest, reply: FastifyReply) {
		if (!request.user) throw new UnauthorizedError("Authentication required")

		const user = await this.getProfileUseCase.execute(request.user.sub)

		return reply.status(HttpStatusCode.OK).send({
			data: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
			status: HttpStatusCode.OK,
		})
	}
}
