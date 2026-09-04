import { describe, expect, it, vi } from "vitest"
import { CreateCampaignUseCase } from "@application/use_cases/campaigns/CreateCampaign"
import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"
import type { IDonorsRepository } from "@application/interfaces/IDonorsRepository"
import type { IJobQueue } from "@application/interfaces/IJobQueue"
import type { CreateCampaignsInput } from "@/application/dtos/campaigns/CreateCampaignInput"
import type { SendCampaignEmailInput } from "@/application/dtos/campaigns/SendCampaignEmailInput"
import { Donor } from "@domain/entities/Donor"
import { ELIGIBILITY_DAYS } from "@domain/rules/donorEligibility"
import { MS_PER_DAY } from "@domain/utils/dateUtils"

const CAMPAIGN_ID = "campaign-1"

const daysAgo = (days: number) => new Date(Date.now() - days * MS_PER_DAY)

/** One donor of each shape the audience rule distinguishes. */
const MATCHING_ELIGIBLE = new Donor(
	"d1",
	"Ana",
	"female",
	"O+",
	daysAgo(ELIGIBILITY_DAYS.female + 1),
	"ana@example.com",
)
const MATCHING_WAITING = new Donor(
	"d2",
	"Bruno",
	"male",
	"O+",
	daysAgo(1),
	"bruno@example.com",
)
const OTHER_ELIGIBLE = new Donor(
	"d3",
	"Carla",
	"female",
	"A-",
	null,
	"carla@example.com",
)
const OTHER_WAITING = new Donor(
	"d4",
	"Davi",
	"male",
	"A-",
	daysAgo(2),
	"davi@example.com",
)

const ALL_DONORS = [
	MATCHING_ELIGIBLE,
	MATCHING_WAITING,
	OTHER_ELIGIBLE,
	OTHER_WAITING,
]

function buildUseCase() {
	const campaignsRepository = {
		create: vi.fn().mockResolvedValue(CAMPAIGN_ID),
		list: vi.fn(),
		listSummary: vi.fn(),
		get: vi.fn(),
		incrementNotifiedCount: vi.fn(),
		closeCampaign: vi.fn(),
	} satisfies ICampaignsRepository

	const donorsRepository = {
		list: vi.fn(),
		findAll: vi.fn().mockResolvedValue(ALL_DONORS),
		findByBloodType: vi
			.fn()
			.mockImplementation(async (bloodType: string) =>
				ALL_DONORS.filter((donor) => donor.bloodType === bloodType),
			),
		countEligibleByBloodType: vi.fn(),
	} satisfies IDonorsRepository

	const jobQueue = {
		enqueueBulk: vi.fn().mockResolvedValue(undefined),
	} as unknown as IJobQueue

	return {
		useCase: new CreateCampaignUseCase(
			campaignsRepository,
			donorsRepository,
			jobQueue,
		),
		campaignsRepository,
		donorsRepository,
		jobQueue,
	}
}

const BASE: Omit<CreateCampaignsInput, "kind"> = {
	title: "Doe sangue",
	message: "Olá [Nome]",
	bloodType: "O+",
}

/** The donors the queue was actually asked to notify. */
function enqueuedJobs(
	jobQueue: IJobQueue,
): Array<{ data: SendCampaignEmailInput }> {
	return vi.mocked(jobQueue.enqueueBulk).mock.calls[0][1] as Array<{
		data: SendCampaignEmailInput
	}>
}

function notifiedIds(jobQueue: IJobQueue): string[] {
	return enqueuedJobs(jobQueue).map((job) => job.data.donorId)
}

describe("CreateCampaignUseCase", () => {
	describe("segmented", () => {
		it("notifies only eligible donors of the targeted blood type", async () => {
			const { useCase, jobQueue, donorsRepository } = buildUseCase()

			await useCase.execute({ ...BASE, kind: "segmented" })

			expect(donorsRepository.findByBloodType).toHaveBeenCalledWith("O+")
			expect(donorsRepository.findAll).not.toHaveBeenCalled()
			expect(notifiedIds(jobQueue)).toEqual([MATCHING_ELIGIBLE.id])
		})

		it("records an audience with no wasted message", async () => {
			const { useCase, campaignsRepository } = buildUseCase()

			await useCase.execute({ ...BASE, kind: "segmented" })

			expect(campaignsRepository.create).toHaveBeenCalledWith(
				expect.objectContaining({
					kind: "segmented",
					bloodType: "O+",
					totalEligibleDonors: 1,
					status: "active",
				}),
			)
		})
	})

	describe("generic", () => {
		it("notifies the whole base, whatever the blood type or eligibility", async () => {
			const { useCase, jobQueue, donorsRepository } = buildUseCase()

			await useCase.execute({ ...BASE, kind: "generic" })

			expect(donorsRepository.findAll).toHaveBeenCalled()
			expect(donorsRepository.findByBloodType).not.toHaveBeenCalled()
			expect(notifiedIds(jobQueue)).toEqual(ALL_DONORS.map((d) => d.id))
		})

		it("records how much of its audience could actually confirm", async () => {
			const { useCase, campaignsRepository } = buildUseCase()

			await useCase.execute({ ...BASE, kind: "generic" })

			expect(campaignsRepository.create).toHaveBeenCalledWith(
				expect.objectContaining({ kind: "generic", totalEligibleDonors: 2 }),
			)
		})

		it("stores no blood type", async () => {
			const { useCase, campaignsRepository } = buildUseCase()

			await useCase.execute({ ...BASE, kind: "generic" })

			expect(campaignsRepository.create).toHaveBeenCalledWith(
				expect.objectContaining({ bloodType: null }),
			)
		})
	})

	it("closes a campaign with nobody to notify, without queueing anything", async () => {
		const { useCase, campaignsRepository, jobQueue } = buildUseCase()

		await useCase.execute({ ...BASE, bloodType: "AB-", kind: "segmented" })

		expect(campaignsRepository.create).toHaveBeenCalledWith(
			expect.objectContaining({ status: "closed", totalEligibleDonors: 0 }),
		)
		expect(jobQueue.enqueueBulk).not.toHaveBeenCalled()
	})
})
