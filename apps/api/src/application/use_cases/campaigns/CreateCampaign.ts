import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"
import type { IDonorsRepository } from "@application/interfaces/IDonorsRepository"
import type { IJobQueue } from "@application/interfaces/IJobQueue"
import { QUEUE_NAMES } from "@/application/queues/queueNames"
import type { CreateCampaignsInput } from "@/application/dtos/campaigns/CreateCampaignInput"
import { JOB_NAMES } from "@/application/queues/jobNames"
import type { SendCampaignEmailInput } from "@/application/dtos/campaigns/SendCampaignEmailInput"

export class CreateCampaignUseCase {
	constructor(
		private readonly campaignsRepository: ICampaignsRepository,
		private readonly donorsRepository: IDonorsRepository,
		private readonly jobQueue: IJobQueue,
	) {}

	async execute(data: CreateCampaignsInput): Promise<string> {
		const eligibleDonors = (
			await this.donorsRepository.findByBloodType(data.bloodType)
		).filter((donor) => donor.isEligible)

		const totalEligibleDonors = eligibleDonors.length

		const campaignId = await this.campaignsRepository.create({
			title: data.title,
			message: data.message,
			bloodType: data.bloodType,
			totalEligibleDonors,
			status: totalEligibleDonors === 0 ? "closed" : "active",
		})

		if (totalEligibleDonors === 0) return campaignId

		await this.jobQueue.enqueueBulk<SendCampaignEmailInput, string>(
			QUEUE_NAMES.CAMPAIGN_EMAIL,
			eligibleDonors.map((donor) => ({
				name: JOB_NAMES.SEND_CAMPAIGN_EMAIL,
				data: {
					campaignId,
					campaignMessage: data.message,
					campaignTitle: data.title,
					donorId: donor.id,
					donorEmail: donor.email,
					donorName: donor.name,
				},
			})),
			{
				queueName: QUEUE_NAMES.CAMPAIGN_LIFECYCLE,
				name: JOB_NAMES.CLOSE_CAMPAIGN,
				data: campaignId,
			},
		)

		return campaignId
	}
}
