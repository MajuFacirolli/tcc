import type { BloodType } from "@domain/value_objects/BloodType"
import type { CampaignKind } from "@domain/value_objects/CampaignKind"
import type { CampaignStatus } from "@domain/value_objects/CampaignStatus"
import type { Campaign } from "@domain/entities/Campaign"

export type GetCampaignOutput = {
	id: string
	title: string
	message: string
	bloodType: BloodType | null
	kind: CampaignKind
	status: CampaignStatus
	notifiedCount: number
	eligibleReached: number
	confirmationsCount: number
	conversionRate: number
	createdAt: string
}

export function toGetCampaignOutput(campaign: Campaign): GetCampaignOutput {
	return {
		id: campaign.id,
		title: campaign.title,
		message: campaign.message,
		bloodType: campaign.bloodType,
		kind: campaign.kind,
		status: campaign.status,
		notifiedCount: campaign.metrics.notifiedCount,
		eligibleReached: campaign.metrics.totalEligibleDonors,
		confirmationsCount: campaign.metrics.intentionConfirmationsCount,
		conversionRate: campaign.metrics.conversionRate,
		createdAt: campaign.createdAt.toISOString(),
	}
}
