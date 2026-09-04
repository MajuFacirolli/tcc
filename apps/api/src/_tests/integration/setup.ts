import "reflect-metadata"
import { TEST_DATABASE_URL, TEST_REDIS_URL } from "./testEnv"

/**
 * Points the application's module-level singletons at the test infrastructure.
 *
 * `db` and `redisConnection` are built from `env` when their module is first imported,
 * and Vitest evaluates setup files before the test module — so assigning here is what
 * makes every repository in the process talk to the disposable database. There is no
 * injectable handle to swap later.
 */
process.env.NODE_ENV = "test"
process.env.DATABASE_URL = TEST_DATABASE_URL
process.env.REDIS_URL = TEST_REDIS_URL
process.env.JWT_SECRET = "test-jwt-secret".padEnd(48, "x")
process.env.WEB_ORIGIN = "http://localhost:5173"
process.env.SMTP_HOST = "localhost"
process.env.SMTP_PORT = "1025"
process.env.SMTP_USER = "test"
process.env.SMTP_PASS = "test"
process.env.SMTP_FROM = "no-reply@test.local"

// Leaving these unset keeps `buildApp` from mounting Bull Board, which would open
// adapters over the queues for no benefit to any assertion.
process.env.DASHBOARD_USER = undefined
process.env.DASHBOARD_PASSWORD = undefined
delete process.env.DASHBOARD_USER
delete process.env.DASHBOARD_PASSWORD

// Fails loudly here rather than as a puzzling error inside a test: if the unit setup
// ever leaks into this project, the URL would still be the mock one.
if (!process.env.DATABASE_URL.endsWith("_test"))
	throw new Error(
		`Integration tests must run against a _test database, got ${process.env.DATABASE_URL}`,
	)
