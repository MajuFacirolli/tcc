import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { uuidv7 } from "uuidv7"

export const users = pgTable("users", {
	id: text()
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	name: text().notNull(),
	email: text().notNull().unique(),
	passwordHash: text().notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
})
