import type { BloodType } from "@domain/value_objects/BloodType"
import type { CampaignKind } from "@domain/value_objects/CampaignKind"
import type { CampaignStatus } from "@domain/value_objects/CampaignStatus"

export type ListCampaignsInput = {
	status?: CampaignStatus
	bloodType?: BloodType
	kind?: CampaignKind
	page: number
	limit?: number
}
