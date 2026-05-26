import { pgEnum } from "drizzle-orm/pg-core"
import { CAMPAIGN_STATUSES } from "@/@types/CampaignStatus"

export const campaignStatusEnum = pgEnum("campaign_status", CAMPAIGN_STATUSES)
