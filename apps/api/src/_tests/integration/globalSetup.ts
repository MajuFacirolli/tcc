import IORedis from "ioredis"
import { ensureDatabase, runMigrations } from "../support/prepareDatabase"
import {
	ADMIN_DATABASE_URL,
	TEST_DATABASE_NAME,
	TEST_DATABASE_URL,
	TEST_REDIS_DB,
	TEST_REDIS_URL,
} from "./testEnv"

/**
 * Prepares the infrastructure once per run: a disposable database, migrated to the
 * current schema, and an empty Redis logical database.
 *
 * The database is not dropped afterwards — recreating and migrating it on every run
 * costs seconds and buys nothing, since truncation between tests gives the same
 * isolation.
 */
export async function setup() {
	await ensureDatabase(ADMIN_DATABASE_URL, TEST_DATABASE_NAME)
	await runMigrations(TEST_DATABASE_URL)

	const redis = new IORedis(TEST_REDIS_URL, { maxRetriesPerRequest: null })

	try {
		if (redis.options.db !== TEST_REDIS_DB)
			throw new Error(
				`Refusing to flush Redis database ${redis.options.db}: the suite only owns ${TEST_REDIS_DB}`,
			)

		await redis.flushdb()
	} finally {
		await redis.quit()
	}
}
