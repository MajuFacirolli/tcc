import "reflect-metadata"
import { sql } from "drizzle-orm"
import IORedis from "ioredis"
import { db } from "@infrastructure/database/drizzle/client"
import {
	bloodBank,
	donors,
	users,
} from "@infrastructure/database/drizzle/schema/index"
import { Argon2PasswordHasher } from "@infrastructure/identity/Argon2PasswordHasher"
import { ELIGIBILITY_DAYS } from "@domain/rules/donorEligibility"
import { MS_PER_DAY } from "@domain/utils/dateUtils"
import { ensureDatabase, runMigrations } from "../support/prepareDatabase"

/**
 * Prepares the world an end-to-end run needs: a disposable database with the current
 * schema, an empty queue, and just enough data to sign in and dispatch one campaign.
 *
 * Run through `tsx` from `apps/api` so the path aliases resolve. Everything it touches
 * is named by the environment the Playwright config passes in.
 */
async function main() {
	const databaseUrl = process.env.DATABASE_URL

	if (!databaseUrl?.endsWith("_e2e"))
		throw new Error(
			`Refusing to prepare "${databaseUrl}": expected an _e2e database`,
		)

	const name = databaseUrl.slice(databaseUrl.lastIndexOf("/") + 1)

	await ensureDatabase(
		process.env.E2E_ADMIN_DATABASE_URL ??
			"postgresql://docker:docker@localhost:5432/postgres",
		name,
	)
	await runMigrations(databaseUrl)

	await db.execute(
		sql`truncate table confirmations, campaigns, donors, users, blood_bank restart identity cascade`,
	)

	await db.insert(users).values({
		name: process.env.SEED_ADMIN_NAME ?? "Administrador E2E",
		email: process.env.SEED_ADMIN_EMAIL ?? "e2e@hemoconnect.test",
		passwordHash: await new Argon2PasswordHasher().hash(
			process.env.SEED_ADMIN_PASSWORD ?? "e2e-password-123",
		),
	})

	await db.insert(bloodBank).values([
		{ id: "O-", bagsCount: 430, minThreshold: 1250 },
		{ id: "O+", bagsCount: 820, minThreshold: 1250 },
		{ id: "A+", bagsCount: 2400, minThreshold: 1250 },
	])

	// A small, known audience: three O- donors past their own waiting interval, plus
	// decoys the segmentation must leave out. Keeping it to a handful means one
	// campaign enqueues three jobs, not a thousand.
	const eligible = (days: number) => new Date(Date.now() - days * MS_PER_DAY)

	await db.insert(donors).values([
		{
			id: "e2e-1",
			name: "Ana Recebedora",
			sex: "female",
			bloodType: "O-",
			lastDonationDate: eligible(ELIGIBILITY_DAYS.female + 5),
			email: "ana@example.com",
		},
		{
			id: "e2e-2",
			name: "Bruno Recebedor",
			sex: "male",
			bloodType: "O-",
			lastDonationDate: eligible(ELIGIBILITY_DAYS.male + 5),
			email: "bruno@example.com",
		},
		{
			id: "e2e-3",
			name: "Carla Recebedora",
			sex: "female",
			bloodType: "O-",
			lastDonationDate: null,
			email: "carla@example.com",
		},
		{
			id: "e2e-waiting",
			name: "Diego Aguardando",
			sex: "male",
			bloodType: "O-",
			lastDonationDate: eligible(ELIGIBILITY_DAYS.male - 1),
			email: "diego@example.com",
		},
		{
			id: "e2e-other",
			name: "Eva Outro Tipo",
			sex: "female",
			bloodType: "A+",
			lastDonationDate: null,
			email: "eva@example.com",
		},
	])

	await db.$client.end()

	const redis = new IORedis(process.env.REDIS_URL as string, {
		maxRetriesPerRequest: null,
	})
	if (redis.options.db !== 14)
		throw new Error(`Refusing to flush Redis database ${redis.options.db}`)
	await redis.flushdb()
	await redis.quit()

	console.log("E2E_PREPARED")
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
