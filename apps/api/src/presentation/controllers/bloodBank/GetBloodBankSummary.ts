import type { GetBloodBankSummaryUseCase } from "@/application/use_cases/bloodBank/GetBloodBankSummary"
import HttpStatusCode from "@/core/StatusCodesEnum"
import type { FastifyReply, FastifyRequest } from "fastify"

export class GetBloodBankSummaryController {
	constructor(
		private readonly getBloodBankSummaryUseCase: GetBloodBankSummaryUseCase,
	) {}

	async handle(_request: FastifyRequest, reply: FastifyReply) {
		const data = await this.getBloodBankSummaryUseCase.execute()
		return reply.status(HttpStatusCode.OK).send({
			data,
			status: HttpStatusCode.OK,
		})
	}
}
