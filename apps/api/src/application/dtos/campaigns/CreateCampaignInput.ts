import type { BloodType } from "@/domain/value_objects/BloodType"
import type { CampaignStatus } from "@/domain/value_objects/CampaignStatus"

export type CreateCampaignsInput = {
	title: string
	message: string
	bloodType: BloodType
	totalEligibleDonors?: number
	status?: CampaignStatus
}
