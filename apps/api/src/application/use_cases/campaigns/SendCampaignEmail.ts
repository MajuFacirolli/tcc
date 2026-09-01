import type { SendCampaignEmailInput } from "@/application/dtos/campaigns/SendCampaignEmailInput"
import type { SimulateDonationIntentionInput } from "@/application/dtos/simulation/SimulateDonationIntentionInput"
import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"
import type { IEmailService } from "@application/interfaces/IEmailService"
import type { IEmailTemplateRenderer } from "@application/interfaces/IEmailTemplateRenderer"
import type { IConfirmationsRepository } from "@application/interfaces/IConfirmationsRepository"
import type { IJobQueue } from "@application/interfaces/IJobQueue"
import { EMAIL_TEMPLATE_NAMES } from "@application/emails/emailTemplateNames"
import { JOB_NAMES } from "@/application/queues/jobNames"
import { QUEUE_NAMES } from "@/application/queues/queueNames"
import {
	simulateDonationIntention,
	toWallClockDelaySeconds,
} from "@domain/simulation/donationIntentionModel"

export class SendCampaignEmailUseCase {
	constructor(
		private readonly emailService: IEmailService,
		private readonly campaignsRepository: ICampaignsRepository,
		private readonly templateRenderer: IEmailTemplateRenderer,
		private readonly confirmationsRepository: IConfirmationsRepository,
		private readonly jobQueue: IJobQueue,
	) {}

	async execute(data: SendCampaignEmailInput): Promise<void> {
		const personalizedMessage = data.campaignMessage.replaceAll(
			"[Nome]",
			data.donorName,
		)

		const token = await this.confirmationsRepository.generateToken({
			campaignId: data.campaignId,
			donorId: data.donorId,
		})

		const { html, text } = await this.templateRenderer.render(
			EMAIL_TEMPLATE_NAMES.CAMPAIGN_INVITATION,
			{
				campaignTitle: data.campaignTitle,
				message: personalizedMessage,
				confirmationLink:
					this.confirmationsRepository.createConfirmationLink(token),
			},
		)

		await this.emailService.send({
			to: data.donorEmail,
			subject: data.campaignTitle,
			html,
			text,
		})

		await this.campaignsRepository.incrementNotifiedCount(data.campaignId)

		await this.scheduleSimulatedResponse(data, token)
	}

	/**
	 * The donor base is synthetic, so nobody will ever click the link that was just
	 * sent. This stands in for that click.
	 *
	 * The response is scheduled here, after the notification, rather than when the
	 * campaign was created: the delay has to be measured from the moment the donor was
	 * reached, which is the same instant `confirmations.createdAt` records.
	 *
	 * The scheduled job goes to its own queue instead of joining the campaign's flow.
	 * A delayed child would hold the `close-campaign` parent open until the last
	 * straggler answered, and a campaign should close when its e-mails are out.
	 */
	private async scheduleSimulatedResponse(
		data: SendCampaignEmailInput,
		token: string,
	): Promise<void> {
		const outcome = simulateDonationIntention({
			campaignId: data.campaignId,
			donorId: data.donorId,
			donorBloodType: data.donorBloodType,
			campaignBloodType: data.campaignBloodType,
			donorIsEligible: data.donorIsEligible,
			stockStatus: data.stockStatus,
		})

		if (!outcome.willConfirm || outcome.responseDelaySeconds === null) return

		await this.jobQueue.enqueue<SimulateDonationIntentionInput>(
			{
				queueName: QUEUE_NAMES.DONATION_INTENTION,
				name: JOB_NAMES.SIMULATE_DONATION_INTENTION,
				data: { token },
			},
			{ delaySeconds: toWallClockDelaySeconds(outcome.responseDelaySeconds) },
		)
	}
}
