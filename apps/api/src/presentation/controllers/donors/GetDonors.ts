import type { FastifyReply } from "fastify"
import type { ListDonorsInput } from "@/application/dtos/donors/ListDonorsInput"
import type { GetDonorsUseCase } from "@application/use_cases/donors/GetDonors"
import HttpStatusCode from "@/core/StatusCodesEnum"

export class GetDonorsController {
	constructor(private readonly getDonorsUseCase: GetDonorsUseCase) {}

	async handle(request: { query: ListDonorsInput }, reply: FastifyReply) {
		const donors = await this.getDonorsUseCase.execute(request.query)
		return reply.status(HttpStatusCode.OK).send({
			data: donors,
			status: HttpStatusCode.OK,
		})
	}
}
