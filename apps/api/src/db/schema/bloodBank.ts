import { integer, pgTable, timestamp } from "drizzle-orm/pg-core"
import { bloodTypeEnum } from "./enums/bloodType"

export const bloodBank = pgTable("blood_bank", {
	id: bloodTypeEnum().primaryKey(),
	bagsCount: integer().notNull().default(0),
	minThreshold: integer().notNull(),
	updatedAt: timestamp().notNull().defaultNow(),
})
