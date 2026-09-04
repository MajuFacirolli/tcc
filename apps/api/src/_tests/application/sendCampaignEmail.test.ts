import { describe, expect, it, vi } from "vitest"
import { SendCampaignEmailUseCase } from "@application/use_cases/campaigns/SendCampaignEmail"
import type { SendCampaignEmailInput } from "@/application/dtos/campaigns/SendCampaignEmailInput"
import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"
import type { IConfirmationsRepository } from "@application/interfaces/IConfirmationsRepository"
import type { IEmailService } from "@application/interfaces/IEmailService"
import type { IEmailTemplateRenderer } from "@application/interfaces/IEmailTemplateRenderer"
import { EMAIL_TEMPLATE_NAMES } from "@application/emails/emailTemplateNames"

const TOKEN = "confirmation-token"

const BASE_INPUT: SendCampaignEmailInput = {
	campaignId: "campaign-1",
	campaignTitle: "Doe sangue",
	campaignMessage: "Olá [Nome], precisamos de você.",
	donorId: "donor-1",
	donorEmail: "donor@example.com",
	donorName: "Ana Souza",
}

function buildUseCase() {
	const emailService: IEmailService = {
		send: vi.fn().mockResolvedValue(undefined),
	}

	const campaignsRepository = {
		incrementNotifiedCount: vi.fn().mockResolvedValue(undefined),
	} as unknown as ICampaignsRepository

	const templateRenderer: IEmailTemplateRenderer = {
		render: vi.fn().mockResolvedValue({ html: "<p>hi</p>", text: "hi" }),
	}

	const confirmationsRepository = {
		generateToken: vi.fn().mockResolvedValue(TOKEN),
		createConfirmationLink: vi.fn().mockReturnValue(`link/${TOKEN}`),
	} as unknown as IConfirmationsRepository

	const useCase = new SendCampaignEmailUseCase(
		emailService,
		campaignsRepository,
		templateRenderer,
		confirmationsRepository,
	)

	return {
		useCase,
		emailService,
		campaignsRepository,
		templateRenderer,
		confirmationsRepository,
	}
}

describe("SendCampaignEmailUseCase", () => {
	it("sends the e-mail and counts the notification", async () => {
		const { useCase, emailService, campaignsRepository } = buildUseCase()

		await useCase.execute(BASE_INPUT)

		expect(emailService.send).toHaveBeenCalledWith(
			expect.objectContaining({
				to: BASE_INPUT.donorEmail,
				subject: BASE_INPUT.campaignTitle,
			}),
		)
		expect(campaignsRepository.incrementNotifiedCount).toHaveBeenCalledWith(
			BASE_INPUT.campaignId,
		)
	})

	it("issues a token first, so the e-mail can carry its confirmation link", async () => {
		const { useCase, confirmationsRepository, templateRenderer } =
			buildUseCase()

		await useCase.execute(BASE_INPUT)

		expect(confirmationsRepository.generateToken).toHaveBeenCalledWith({
			campaignId: BASE_INPUT.campaignId,
			donorId: BASE_INPUT.donorId,
		})
		expect(templateRenderer.render).toHaveBeenCalledWith(
			EMAIL_TEMPLATE_NAMES.CAMPAIGN_INVITATION,
			expect.objectContaining({ confirmationLink: `link/${TOKEN}` }),
		)
	})

	it("addresses the donor by name in the message", async () => {
		const { useCase, templateRenderer } = buildUseCase()

		await useCase.execute(BASE_INPUT)

		expect(templateRenderer.render).toHaveBeenCalledWith(
			EMAIL_TEMPLATE_NAMES.CAMPAIGN_INVITATION,
			expect.objectContaining({
				message: `Olá ${BASE_INPUT.donorName}, precisamos de você.`,
			}),
		)
	})
})
