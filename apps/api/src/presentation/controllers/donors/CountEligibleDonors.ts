import type { FastifyReply } from "fastify"
import type { CountEligibleDonorsInput } from "@/application/dtos/donors/CountEligibleDonorsInput"
import type { CountEligibleDonorsUseCase } from "@application/use_cases/donors/CountEligibleDonors"
import HttpStatusCode from "@/core/StatusCodesEnum"

export class CountEligibleDonorsController {
	constructor(
		private readonly countEligibleDonorsUseCase: CountEligibleDonorsUseCase,
	) {}

	async handle(
		request: { query: CountEligibleDonorsInput },
		reply: FastifyReply,
	) {
		const count = await this.countEligibleDonorsUseCase.execute(request.query)
		return reply.status(HttpStatusCode.OK).send({
			data: count,
			status: HttpStatusCode.OK,
		})
	}
}
