import type { FastifyReply, FastifyRequest } from "fastify"
import type { GetCampaignUseCase } from "@application/use_cases/campaigns/GetCampaign"
import HttpStatusCode from "@/core/StatusCodesEnum"

export class GetCampaignController {
	constructor(private readonly getCampaignUseCase: GetCampaignUseCase) {}

	async handle(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const campaign = await this.getCampaignUseCase.execute(request.params.id)
		return reply.status(HttpStatusCode.OK).send({
			data: {
				id: campaign.id,
				title: campaign.title,
				message: campaign.message,
				bloodType: campaign.bloodType,
				status: campaign.status,
				notifiedCount: campaign.metrics.notifiedCount,
				confirmationsCount: campaign.metrics.intentionConfirmationsCount,
				conversionRate: campaign.metrics.conversionRate,
				createdAt: campaign.createdAt,
			},
			status: HttpStatusCode.OK,
		})
	}
}
