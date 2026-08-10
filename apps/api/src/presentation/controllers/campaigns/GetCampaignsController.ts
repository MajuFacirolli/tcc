import type { FastifyReply } from "fastify"
import type { ListCampaignsInputDTO } from "@/application/dtos/campaigns/ListCampaignsInputDTO"
import type { GetCampaignsUseCase } from "@application/use_cases/campaigns/GetCampaigns"
import HttpStatusCode from "@/core/StatusCodesEnum"

export class GetCampaignsController {
	constructor(private readonly getCampaignsUseCase: GetCampaignsUseCase) {}

	async handle(request: { query: ListCampaignsInputDTO }, reply: FastifyReply) {
		const campaigns = await this.getCampaignsUseCase.execute(request.query)
		return reply.status(HttpStatusCode.OK).send({
			data: campaigns,
			status: HttpStatusCode.OK,
		})
	}
}
