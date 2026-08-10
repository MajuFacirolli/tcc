export const CampaignStatusEnum = {
	ACTIVE: "active",
	DRAFT: "draft",
	CLOSED: "closed",
} as const

export type CampaignStatusEnum =
	(typeof CampaignStatusEnum)[keyof typeof CampaignStatusEnum]

export const CAMPAIGN_STATUSES = Object.values(CampaignStatusEnum)
