export const CAMPAIGN_STATUSES = ["active", "closed"] as const

export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number]
