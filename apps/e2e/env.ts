/**
 * The one place the end-to-end run is configured.
 *
 * Every port, URL and database name is derived from here, because three of them have
 * to agree exactly or the session cookie is silently dropped: the API's CORS origin,
 * the origin the browser actually visits, and the API the web app calls.
 *
 * The ports are deliberately not the development ones, so a running `pnpm dev` is left
 * alone. The database and the Redis index are a third set, distinct from both
 * development and the integration suite, so the two test runs cannot collide.
 */
export const API_PORT = 3401
export const WEB_PORT = 5273

export const WEB_ORIGIN = `http://localhost:${WEB_PORT}`
export const API_URL = `http://localhost:${API_PORT}/api`

export const E2E_DATABASE_NAME = "hemoconnect_e2e"
export const ADMIN_DATABASE_URL =
	"postgresql://docker:docker@localhost:5432/postgres"
export const E2E_DATABASE_URL = `postgresql://docker:docker@localhost:5432/${E2E_DATABASE_NAME}`

/** Development uses 0 and the integration suite uses 15. */
export const E2E_REDIS_DB = 14
export const E2E_REDIS_URL = `redis://localhost:6379/${E2E_REDIS_DB}`

export const ADMIN = {
	name: "Administrador E2E",
	email: "e2e@hemoconnect.test",
	password: "e2e-password-123",
}

/** Forwarded to both the API and the worker, so they share one world. */
export const apiEnv: Record<string, string> = {
	NODE_ENV: "test",
	PORT: String(API_PORT),
	DATABASE_URL: E2E_DATABASE_URL,
	REDIS_URL: E2E_REDIS_URL,
	WEB_ORIGIN,
	JWT_SECRET: "e2e-jwt-secret".padEnd(48, "x"),
	SESSION_DURATION: "7d",
	// No message may leave the machine during a test run.
	EMAIL_TRANSPORT: "noop",
	SMTP_HOST: "localhost",
	SMTP_PORT: "1025",
	SMTP_USER: "e2e",
	SMTP_PASS: "e2e",
	SMTP_FROM: "no-reply@e2e.test",
	SEED_ADMIN_NAME: ADMIN.name,
	SEED_ADMIN_EMAIL: ADMIN.email,
	SEED_ADMIN_PASSWORD: ADMIN.password,
}
