import { resolve } from "node:path"
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Client, Pool } from "pg"

/**
 * Creates and migrates a throwaway database.
 *
 * This module deliberately imports nothing from `src/` other than itself. It runs in
 * Vitest's main process and in a bare `tsx` script, where `DATABASE_URL` is still
 * whatever the developer's shell holds — pulling in `@/env` here would build the
 * application's connection against the *development* database.
 */

/**
 * The one line that makes it impossible to point the harness at real data: a name that
 * is not visibly disposable is refused before any statement runs.
 */
function assertDisposable(name: string) {
	if (!name.endsWith("_test") && !name.endsWith("_e2e"))
		throw new Error(
			`Refusing to prepare "${name}": a test database name must end in _test or _e2e`,
		)
}

export async function ensureDatabase(adminUrl: string, name: string) {
	assertDisposable(name)

	const client = new Client({ connectionString: adminUrl })
	await client.connect()

	try {
		const { rowCount } = await client.query(
			"select 1 from pg_database where datname = $1",
			[name],
		)

		// CREATE DATABASE takes no bound parameter, and `name` has just been checked
		// against a fixed suffix, so the interpolation cannot carry arbitrary input.
		if (!rowCount) await client.query(`create database "${name}"`)
	} finally {
		await client.end()
	}
}

export async function runMigrations(databaseUrl: string) {
	const pool = new Pool({ connectionString: databaseUrl })

	try {
		await migrate(drizzle(pool, { casing: "snake_case" }), {
			// Every api script runs with `apps/api` as its cwd, the same assumption
			// drizzle.config.ts makes. `import.meta.dirname` is not dependable here:
			// the package is commonjs and this file is also loaded by a tsx script.
			migrationsFolder: resolve(
				process.cwd(),
				"src/infrastructure/database/drizzle/migrations",
			),
		})
	} finally {
		await pool.end()
	}
}
