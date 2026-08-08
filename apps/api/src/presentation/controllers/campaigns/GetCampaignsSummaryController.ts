import type { FastifyReply, FastifyRequest } from "fastify"
import type { GetCampaignsSummaryUseCase } from "@application/use_cases/campaigns/GetCampaignsSummary"
import HttpStatusCode from "@/core/StatusCodesEnum"

export class GetCampaignsSummaryController {
	constructor(
		private readonly getCampaignsSummaryUseCase: GetCampaignsSummaryUseCase,
	) {}

	async handle(_request: FastifyRequest, reply: FastifyReply) {
		const campaigns = await this.getCampaignsSummaryUseCase.execute()
		return reply.status(HttpStatusCode.OK).send({
			data: campaigns,
			status: HttpStatusCode.OK,
		})
	}
}
