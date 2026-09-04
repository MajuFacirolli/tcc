import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { uuidv7 } from "uuidv7"
import { bloodTypeEnum } from "./enums/bloodType"
import { campaignKindEnum } from "./enums/campaignKind"
import { campaignStatusEnum } from "./enums/campaignStatus"

export const campaigns = pgTable("campaigns", {
	id: text()
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	title: text().notNull(),
	message: text().notNull(),
	/** `null` for a generic campaign, which asks for no type in particular. */
	bloodType: bloodTypeEnum(),
	kind: campaignKindEnum().notNull().default("segmented"),
	status: campaignStatusEnum().notNull().default("active"),
	/** How many of the notified donors were past their waiting interval. */
	totalEligibleDonors: integer().notNull().default(0),
	notifiedCount: integer().notNull().default(0),
	intentionConfirmationsCount: integer().notNull().default(0),
	averageResponseTime: integer().notNull().default(0),
	createdAt: timestamp().notNull().defaultNow(),
})
