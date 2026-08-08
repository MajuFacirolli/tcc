import type { FastifyReply } from "fastify"
import type { CreateCampaignUseCase } from "@application/use_cases/campaigns/CreateCampaign"
import type { ICreateCampaignParams } from "@application/interfaces/ICampaignsRepository"
import HttpStatusCode from "@/core/StatusCodesEnum"

export class CreateCampaignController {
	constructor(private readonly createCampaignUseCase: CreateCampaignUseCase) {}

	async handle(request: { body: ICreateCampaignParams }, reply: FastifyReply) {
		const id = await this.createCampaignUseCase.execute(request.body)
		return reply.status(HttpStatusCode.CREATED).send({
			data: id,
			status: HttpStatusCode.CREATED,
		})
	}
}
