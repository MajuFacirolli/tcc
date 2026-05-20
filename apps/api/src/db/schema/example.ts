import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { uuidv7 } from "uuidv7"

export const example = pgTable("example", {
	id: text()
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	createdAt: timestamp().notNull().defaultNow(),
})
