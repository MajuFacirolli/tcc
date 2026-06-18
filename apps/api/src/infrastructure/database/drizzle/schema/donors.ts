import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { uuidv7 } from "uuidv7"
import { bloodTypeEnum } from "./enums/bloodType"
import { sexEnum } from "./enums/sex"

export const donors = pgTable("donors", {
	id: text()
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	name: text().notNull(),
	sex: sexEnum().notNull(),
	bloodType: bloodTypeEnum().notNull(),
	lastDonationDate: timestamp(),
	email: text().notNull(),
})
