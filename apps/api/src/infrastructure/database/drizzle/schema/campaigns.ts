import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { uuidv7 } from "uuidv7"
import { bloodTypeEnum } from "./enums/bloodType"
import { campaignStatusEnum } from "./enums/campaignStatus"

export const campaigns = pgTable("campaigns", {
	id: text()
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	title: text().notNull(),
	message: text().notNull(),
	bloodType: bloodTypeEnum().notNull(),
	status: campaignStatusEnum().notNull().default("active"),
	totalEligibleDonors: integer().notNull().default(0),
	notifiedCount: integer().notNull().default(0),
	intentionConfirmationsCount: integer().notNull().default(0),
	averageResponseTime: integer().notNull().default(0),
	createdAt: timestamp().notNull().defaultNow(),
})
