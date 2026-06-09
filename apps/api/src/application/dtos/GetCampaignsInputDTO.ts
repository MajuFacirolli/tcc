import type { BloodType } from "@domain/value_objects/BloodType"
import type { CampaignStatus } from "@domain/value_objects/CampaignStatus"

export type GetCampaignsInputDTO = {
	status?: CampaignStatus
	bloodType?: BloodType
}
