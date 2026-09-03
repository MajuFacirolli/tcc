import { pgEnum } from "drizzle-orm/pg-core"
import { CAMPAIGN_KINDS } from "@domain/value_objects/CampaignKind"

export const campaignKindEnum = pgEnum("campaign_kind", CAMPAIGN_KINDS)
