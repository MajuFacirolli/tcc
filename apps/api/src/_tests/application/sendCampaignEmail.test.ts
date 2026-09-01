import { beforeEach, describe, expect, it, vi } from "vitest"
import { SendCampaignEmailUseCase } from "@application/use_cases/campaigns/SendCampaignEmail"
import type { SendCampaignEmailInput } from "@/application/dtos/campaigns/SendCampaignEmailInput"
import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"
import type { IConfirmationsRepository } from "@application/interfaces/IConfirmationsRepository"
import type { IEmailService } from "@application/interfaces/IEmailService"
import type { IEmailTemplateRenderer } from "@application/interfaces/IEmailTemplateRenderer"
import type { IJobQueue } from "@application/interfaces/IJobQueue"
import { JOB_NAMES } from "@/application/queues/jobNames"
import { QUEUE_NAMES } from "@/application/queues/queueNames"
import { simulateDonationIntention } from "@domain/simulation/donationIntentionModel"

const TOKEN = "confirmation-token"

const BASE_INPUT: SendCampaignEmailInput = {
	campaignId: "campaign-1",
	campaignTitle: "Doe sangue",
	campaignMessage: "Olá [Nome], precisamos de você.",
	campaignBloodType: "O+",
	donorId: "donor-1",
	donorEmail: "donor@example.com",
	donorName: "Ana Souza",
	donorBloodType: "O+",
	donorIsEligible: true,
	stockStatus: "critical",
}

/**
 * A donor the model actually says yes to, so the scheduling assertions are not
 * silently passing on a donor who was never going to respond.
 */
function findConfirmingDonorId(): string {
	for (let index = 0; index < 500; index++) {
		const donorId = `donor-${index}`
		const outcome = simulateDonationIntention({ ...BASE_INPUT, donorId })
		if (outcome.willConfirm) return donorId
	}

	throw new Error("no confirming donor found — the model may be misconfigured")
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

	const jobQueue: IJobQueue = {
		enqueue: vi.fn().mockResolvedValue(undefined),
		enqueueBulk: vi.fn().mockResolvedValue(undefined),
	}

	const useCase = new SendCampaignEmailUseCase(
		emailService,
		campaignsRepository,
		templateRenderer,
		confirmationsRepository,
		jobQueue,
	)

	return {
		useCase,
		emailService,
		campaignsRepository,
		templateRenderer,
		confirmationsRepository,
		jobQueue,
	}
}

describe("SendCampaignEmailUseCase", () => {
	let confirmingDonorId: string

	beforeEach(() => {
		confirmingDonorId = findConfirmingDonorId()
	})

	it("still sends the e-mail and counts the notification", async () => {
		// The simulation is additive: none of the existing behaviour may regress.
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

	it("schedules a delayed response for a donor who confirms", async () => {
		const { useCase, jobQueue } = buildUseCase()

		await useCase.execute({ ...BASE_INPUT, donorId: confirmingDonorId })

		expect(jobQueue.enqueue).toHaveBeenCalledTimes(1)

		const [job, options] = vi.mocked(jobQueue.enqueue).mock.calls[0] as [
			{ queueName: string; name: string; data: { token: string } },
			{ delaySeconds: number },
		]

		expect(job.queueName).toBe(QUEUE_NAMES.DONATION_INTENTION)
		expect(job.name).toBe(JOB_NAMES.SIMULATE_DONATION_INTENTION)
		expect(job.data).toEqual({ token: TOKEN })
		expect(options.delaySeconds).toBeGreaterThan(0)
	})

	it("schedules nothing for an ineligible donor", async () => {
		const { useCase, jobQueue, emailService } = buildUseCase()

		await useCase.execute({
			...BASE_INPUT,
			donorId: confirmingDonorId,
			donorIsEligible: false,
		})

		expect(jobQueue.enqueue).not.toHaveBeenCalled()
		// The notification itself is unaffected — only the simulated response is.
		expect(emailService.send).toHaveBeenCalledTimes(1)
	})

	it("schedules the same response when the job is retried", async () => {
		const first = buildUseCase()
		const second = buildUseCase()
		const input = { ...BASE_INPUT, donorId: confirmingDonorId }

		await first.useCase.execute(input)
		await second.useCase.execute(input)

		expect(vi.mocked(first.jobQueue.enqueue).mock.calls).toEqual(
			vi.mocked(second.jobQueue.enqueue).mock.calls,
		)
	})
})
