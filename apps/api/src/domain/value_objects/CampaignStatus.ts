export const CAMPAIGN_STATUSES = ["active", "draft", "closed"] as const

export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number]
