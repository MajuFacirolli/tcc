import type { BloodType } from "@/domain/value_objects/BloodType"
import type { CampaignKind } from "@/domain/value_objects/CampaignKind"
import type { CampaignStatus } from "@/domain/value_objects/CampaignStatus"

export type CreateCampaignsInput = {
	title: string
	message: string
	/** Required for a segmented campaign; a generic one asks for no type. */
	bloodType: BloodType | null
	kind: CampaignKind
	totalEligibleDonors?: number
	status?: CampaignStatus
}
