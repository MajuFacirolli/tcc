import type { FastifyReply } from "fastify"
import type { GetCampaignUseCase } from "@application/use_cases/campaigns/GetCampaign"
import HttpStatusCode from "@/core/StatusCodesEnum"

export class GetCampaignController {
	constructor(private readonly getCampaignUseCase: GetCampaignUseCase) {}

	async handle(request: { params: { id: string } }, reply: FastifyReply) {
		const campaign = await this.getCampaignUseCase.execute(request.params.id)
		return reply.status(HttpStatusCode.OK).send({
			data: campaign,
			status: HttpStatusCode.OK,
		})
	}
}
