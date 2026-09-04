/**
 * Where the integration suite is allowed to touch.
 *
 * Kept free of any `src/` import so `globalSetup` can read it without dragging the
 * application's env parsing into Vitest's main process.
 *
 * The development database and Redis database 0 are never named here: `hemoconnect`
 * holds the data the dissertation is demonstrated from, and a running worker drains
 * queues on Redis 0.
 */
export const TEST_DATABASE_NAME = "hemoconnect_test"

export const ADMIN_DATABASE_URL =
	process.env.TEST_ADMIN_DATABASE_URL ??
	"postgresql://docker:docker@localhost:5432/postgres"

export const TEST_DATABASE_URL =
	process.env.TEST_DATABASE_URL ??
	`postgresql://docker:docker@localhost:5432/${TEST_DATABASE_NAME}`

/** Logical database 15; development uses 0 and the E2E run uses 14. */
export const TEST_REDIS_DB = 15

export const TEST_REDIS_URL =
	process.env.TEST_REDIS_URL ?? `redis://localhost:6379/${TEST_REDIS_DB}`
