import type { FastifyReply, FastifyRequest } from "fastify"
import type { IGetCampaignsParams } from "@application/interfaces/ICampaignsRepository"
import type { GetCampaignsUseCase } from "@application/use_cases/campaigns/GetCampaigns"

export class GetCampaignsController {
	constructor(private readonly getCampaignsUseCase: GetCampaignsUseCase) {}

	async handle(
		request: FastifyRequest<{ Querystring: IGetCampaignsParams }>,
		reply: FastifyReply,
	) {
		const campaigns = await this.getCampaignsUseCase.execute(request.query)
		return reply.status(200).send(campaigns)
	}
}
