import type { IBloodBankRepository } from "@application/interfaces/IBloodBankRepository"
import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"
import type { IDonorsRepository } from "@application/interfaces/IDonorsRepository"
import type { IJobQueue } from "@application/interfaces/IJobQueue"
import { QUEUE_NAMES } from "@/application/queues/queueNames"
import type { CreateCampaignsInput } from "@/application/dtos/campaigns/CreateCampaignInput"
import { JOB_NAMES } from "@/application/queues/jobNames"
import type { SendCampaignEmailInput } from "@/application/dtos/campaigns/SendCampaignEmailInput"
import type { BloodBankStatus } from "@/domain/value_objects/BloodBankStatus"
import type { BloodType } from "@/domain/value_objects/BloodType"

export class CreateCampaignUseCase {
	constructor(
		private readonly campaignsRepository: ICampaignsRepository,
		private readonly donorsRepository: IDonorsRepository,
		private readonly jobQueue: IJobQueue,
		private readonly bloodBankRepository: IBloodBankRepository,
	) {}

	async execute(data: CreateCampaignsInput): Promise<string> {
		const [donorsOfBloodType, stockStatus] = await Promise.all([
			this.donorsRepository.findByBloodType(data.bloodType),
			this.resolveStockStatus(data.bloodType),
		])

		const eligibleDonors = donorsOfBloodType.filter((donor) => donor.isEligible)

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
					campaignBloodType: data.bloodType,
					donorId: donor.id,
					donorEmail: donor.email,
					donorName: donor.name,
					donorBloodType: donor.bloodType,
					donorIsEligible: donor.isEligible,
					stockStatus,
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

	/**
	 * How scarce the campaign's blood type is right now, read once per campaign and
	 * carried in each notification. Frozen at send time on purpose: a donor reacts to
	 * the urgency of the message they received, not to the stock level whenever their
	 * response happens to be processed.
	 *
	 * A blood type with no stock row is treated as `stable`, the level that adds
	 * nothing to the model — a missing row is not evidence of scarcity.
	 */
	private async resolveStockStatus(
		bloodType: BloodType,
	): Promise<BloodBankStatus> {
		const bloodBank = await this.bloodBankRepository.list()

		return bloodBank.find((entry) => entry.id === bloodType)?.status ?? "stable"
	}
}
