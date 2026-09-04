import { describe, expect, it } from "vitest"
import { sql } from "drizzle-orm"
import { db } from "@infrastructure/database/drizzle/client"
import { truncateAll } from "./helpers/database"

describe("integration harness", () => {
	it("runs against the disposable database, never the development one", async () => {
		const [row] = (
			await db.execute<{ name: string }>(sql`select current_database() as name`)
		).rows

		expect(row.name).toBe("hemoconnect_test")
	})

	it("has the migrated schema", async () => {
		const { rows } = await db.execute<{ table_name: string }>(
			sql`select table_name from information_schema.tables where table_schema = 'public' order by table_name`,
		)

		expect(rows.map((r) => r.table_name)).toEqual(
			expect.arrayContaining([
				"blood_bank",
				"campaigns",
				"confirmations",
				"donors",
				"users",
			]),
		)
	})

	it("can be truncated", async () => {
		await expect(truncateAll()).resolves.not.toThrow()
	})
})
