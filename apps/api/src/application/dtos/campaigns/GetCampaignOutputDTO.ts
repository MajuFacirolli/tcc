import type { BloodType } from "@domain/value_objects/BloodType"
import type { CampaignStatus } from "@domain/value_objects/CampaignStatus"
import type { Campaign } from "@domain/entities/Campaign"

export type GetCampaignOutputDTO = {
	id: string
	title: string
	message: string
	bloodType: BloodType
	status: CampaignStatus
	notifiedCount: number
	confirmationsCount: number
	conversionRate: number
	createdAt: string
}

export function toGetCampaignOutputDTO(
	campaign: Campaign,
): GetCampaignOutputDTO {
	return {
		id: campaign.id,
		title: campaign.title,
		message: campaign.message,
		bloodType: campaign.bloodType,
		status: campaign.status,
		notifiedCount: campaign.metrics.notifiedCount,
		confirmationsCount: campaign.metrics.intentionConfirmationsCount,
		conversionRate: campaign.metrics.conversionRate,
		createdAt: campaign.createdAt.toISOString(),
	}
}
