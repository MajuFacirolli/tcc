import type { IBloodBankRepository } from "@application/interfaces/IBloodBankRepository"
import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"
import type { IDonorsRepository } from "@application/interfaces/IDonorsRepository"
import type { IJobQueue } from "@application/interfaces/IJobQueue"
import { QUEUE_NAMES } from "@/application/queues/queueNames"
import type { CreateCampaignsInput } from "@/application/dtos/campaigns/CreateCampaignInput"
import { JOB_NAMES } from "@/application/queues/jobNames"
import type { SendCampaignEmailInput } from "@/application/dtos/campaigns/SendCampaignEmailInput"
import {
	countEligibleInAudience,
	selectCampaignAudience,
} from "@domain/rules/campaignAudience"
import type { Donor } from "@/domain/entities/Donor"
import {
	type BloodBankStatus,
	mostSevereStatus,
} from "@/domain/value_objects/BloodBankStatus"
import type { BloodType } from "@/domain/value_objects/BloodType"
import type { CampaignKind } from "@/domain/value_objects/CampaignKind"

export class CreateCampaignUseCase {
	constructor(
		private readonly campaignsRepository: ICampaignsRepository,
		private readonly donorsRepository: IDonorsRepository,
		private readonly jobQueue: IJobQueue,
		private readonly bloodBankRepository: IBloodBankRepository,
	) {}

	async execute(data: CreateCampaignsInput): Promise<string> {
		const bloodType = data.kind === "generic" ? null : data.bloodType

		const [candidates, stockStatus] = await Promise.all([
			this.loadCandidates(data.kind, bloodType),
			this.resolveStockStatus(bloodType),
		])

		const audience = selectCampaignAudience(candidates, data.kind, bloodType)

		const campaignId = await this.campaignsRepository.create({
			title: data.title,
			message: data.message,
			bloodType,
			kind: data.kind,
			totalEligibleDonors: countEligibleInAudience(audience),
			status: audience.length === 0 ? "closed" : "active",
		})

		if (audience.length === 0) return campaignId

		await this.jobQueue.enqueueBulk<SendCampaignEmailInput, string>(
			QUEUE_NAMES.CAMPAIGN_EMAIL,
			audience.map((donor) => ({
				name: JOB_NAMES.SEND_CAMPAIGN_EMAIL,
				data: {
					campaignId,
					campaignMessage: data.message,
					campaignTitle: data.title,
					campaignBloodType: bloodType,
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

	private loadCandidates(
		kind: CampaignKind,
		bloodType: BloodType | null,
	): Promise<Array<Donor>> {
		return kind === "generic" || bloodType === null
			? this.donorsRepository.findAll()
			: this.donorsRepository.findByBloodType(bloodType)
	}

	/**
	 * Frozen at send time: a donor reacts to the urgency of the message they received,
	 * not to the stock level whenever their response is processed.
	 *
	 * A generic campaign names no blood type, so it carries the bank's worst level —
	 * a general appeal goes out because something is short. This also keeps urgency
	 * comparable between the two arms of the trial instead of handing the generic one a
	 * quieter message.
	 */
	private async resolveStockStatus(
		bloodType: BloodType | null,
	): Promise<BloodBankStatus> {
		const bloodBank = await this.bloodBankRepository.list()

		if (bloodType === null)
			return mostSevereStatus(bloodBank.map((entry) => entry.status))

		return bloodBank.find((entry) => entry.id === bloodType)?.status ?? "stable"
	}
}
