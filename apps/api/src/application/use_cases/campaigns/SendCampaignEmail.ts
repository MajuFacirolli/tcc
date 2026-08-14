import type { SendCampaignEmailInput } from "@/application/dtos/campaigns/SendCampaignEmailInput"
import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"
import type { IEmailService } from "@application/interfaces/IEmailService"
import type { IEmailTemplateRenderer } from "@application/interfaces/IEmailTemplateRenderer"
import { EMAIL_TEMPLATE_NAMES } from "@application/emails/emailTemplateNames"

export class SendCampaignEmailUseCase {
	constructor(
		private readonly emailService: IEmailService,
		private readonly campaignsRepository: ICampaignsRepository,
		private readonly templateRenderer: IEmailTemplateRenderer,
	) {}

	async execute(data: SendCampaignEmailInput): Promise<void> {
		const personalizedMessage = data.campaignMessage.replaceAll(
			"[Nome]",
			data.donorName,
		)

		const { html, text } = await this.templateRenderer.render(
			EMAIL_TEMPLATE_NAMES.CAMPAIGN_INVITATION,
			{
				campaignTitle: data.campaignTitle,
				message: personalizedMessage,
			},
		)

		await this.emailService.send({
			to: data.donorEmail,
			subject: data.campaignTitle,
			html,
			text,
		})

		await this.campaignsRepository.incrementNotifiedCount(data.campaignId)
	}
}
