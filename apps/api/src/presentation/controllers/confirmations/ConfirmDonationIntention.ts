import type { ConfirmDonationIntentionUseCase } from "@/application/use_cases/confirmations/ConfirmDonationIntention"
import HttpStatusCode from "@/core/StatusCodesEnum"
import type { FastifyReply } from "fastify"

export class ConfirmDonationIntentionController {
	constructor(
		private readonly confirmDonationIntentionUseCase: ConfirmDonationIntentionUseCase,
	) {}

	async handle(request: { params: { token: string } }, reply: FastifyReply) {
		const data = await this.confirmDonationIntentionUseCase.execute(
			request.params.token,
		)

		return reply.status(HttpStatusCode.OK).send({
			data: {
				confirmedAt: data.confirmedAt.toISOString(),
			},
			status: HttpStatusCode.OK,
		})
	}
}
