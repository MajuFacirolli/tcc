import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { uuidv7 } from "uuidv7"
import { campaigns } from "./campaigns"
import { donors } from "./donors"

export const confirmations = pgTable(
	"confirmations",
	{
		id: text()
			.primaryKey()
			.$defaultFn(() => uuidv7()),
		token: text().notNull().unique(),
		campaignId: text()
			.notNull()
			.references(() => campaigns.id),
		donorId: text()
			.notNull()
			.references(() => donors.id),
		confirmedAt: timestamp(),
		createdAt: timestamp().notNull().defaultNow(),
	},
	(table) => [
		uniqueIndex("confirmations_campaign_id_donor_id_unique").on(
			table.campaignId,
			table.donorId,
		),
	],
)
