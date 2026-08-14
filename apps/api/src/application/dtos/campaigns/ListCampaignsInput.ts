import type { BloodType } from "@domain/value_objects/BloodType"
import type { CampaignStatus } from "@domain/value_objects/CampaignStatus"

export type ListCampaignsInput = {
	status?: CampaignStatus
	bloodType?: BloodType
	page: number
	limit?: number
}
