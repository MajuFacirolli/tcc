import { sql } from "drizzle-orm"
import { db } from "@infrastructure/database/drizzle/client"

/**
 * Empties every table. Called in `beforeEach` rather than `afterEach` so a crashed
 * test still leaves a clean slate for the next one.
 *
 * `cascade` covers the confirmations → campaigns/donors foreign keys.
 */
export async function truncateAll() {
	await db.execute(
		sql`truncate table confirmations, campaigns, donors, users, blood_bank restart identity cascade`,
	)
}

export async function closeDatabase() {
	await db.$client.end()
}
