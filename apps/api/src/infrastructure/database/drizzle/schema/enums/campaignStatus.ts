import { pgEnum } from "drizzle-orm/pg-core"
import { CAMPAIGN_STATUSES } from "@domain/value_objects/CampaignStatus"

export const campaignStatusEnum = pgEnum("campaign_status", CAMPAIGN_STATUSES)
