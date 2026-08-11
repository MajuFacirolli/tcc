import { z } from "zod"

const DURATION_PATTERN = /^(\d+)([smhd])?$/

const DURATION_UNIT_SECONDS: Record<string, number> = {
	s: 1,
	m: 60,
	h: 3600,
	d: 86400,
}

/**
 * Normalizes a duration like "7d", "12h" or a bare number of seconds into
 * seconds — the unit @fastify/jwt uses for a numeric `expiresIn`, and the unit
 * a cookie Max-Age needs.
 */
const durationInSeconds = z
	.string()
	.trim()
	.regex(DURATION_PATTERN, 'Expected a duration like "7d", "12h" or seconds')
	.default("7d")
	.transform((value) => {
		const [, amount, unit = "s"] = DURATION_PATTERN.exec(
			value,
		) as RegExpExecArray
		return Number(amount) * DURATION_UNIT_SECONDS[unit]
	})

const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	DATABASE_URL: z.url(),
	JWT_SECRET: z.string().min(32),
	SESSION_DURATION: durationInSeconds,
	WEB_ORIGIN: z.url().default("http://localhost:5173"),
	SEED_ADMIN_NAME: z.string().min(1).optional(),
	SEED_ADMIN_EMAIL: z.email().optional(),
	SEED_ADMIN_PASSWORD: z.string().min(8).optional(),
	REDIS_URL: z.url(),
})

export const env = envSchema.parse(process.env)
