export const CampaignKindEnum = {
	GENERIC: "generic",
	SEGMENTED: "segmented",
} as const

export type CampaignKindEnum =
	(typeof CampaignKindEnum)[keyof typeof CampaignKindEnum]

export const CAMPAIGN_KINDS = Object.values(CampaignKindEnum)
