/**
 * How a campaign chose who to notify — the independent variable of the experiment.
 * `generic` broadcasts to the whole base; `segmented` filters by blood type and
 * eligibility.
 */
export const CAMPAIGN_KINDS = ["generic", "segmented"] as const

export type CampaignKind = (typeof CAMPAIGN_KINDS)[number]

export const DEFAULT_CAMPAIGN_KIND: CampaignKind = "segmented"
