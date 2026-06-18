import type { BloodType } from "@domain/value_objects/BloodType"
import type { CampaignStatus } from "@domain/value_objects/CampaignStatus"

export type GetCampaignOutputDTO = {
	id: string
	title: string
	message: string
	bloodType: BloodType
	status: CampaignStatus
	notifiedCount: number
	confirmationsCount: number
	conversionRate: number
	createdAt: Date
}
