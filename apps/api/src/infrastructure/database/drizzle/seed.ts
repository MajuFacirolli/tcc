import "reflect-metadata"
import { env } from "@/env"
import type { BloodType } from "@domain/value_objects/BloodType"
import { Argon2PasswordHasher } from "@infrastructure/identity/Argon2PasswordHasher"
import { db } from "./client"
import { bloodBank, users } from "./schema/index"

const MIN_THRESHOLD = 1250

const INITIAL_BAGS_COUNT = {
	"A+": 2400,
	"A-": 1980,
	"B+": 1400,
	"B-": 1100,
	"AB+": 1600,
	"AB-": 1900,
	"O+": 820,
	"O-": 430,
} satisfies Record<BloodType, number>

async function seedAdmin() {
	const name = env.SEED_ADMIN_NAME
	const email = env.SEED_ADMIN_EMAIL?.trim().toLowerCase()
	const password = env.SEED_ADMIN_PASSWORD

	if (!name || !email || !password) {
		throw new Error(
			"SEED_ADMIN_NAME, SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must all be set",
		)
	}

	const passwordHash = await new Argon2PasswordHasher().hash(password)

	await db
		.insert(users)
		.values({ name, email, passwordHash })
		.onConflictDoUpdate({
			target: users.email,
			set: { name, passwordHash, updatedAt: new Date() },
		})

	console.log(`✅ Seeded admin user: ${email}`)
}

async function seedBloodBank() {
	const rows = Object.entries(INITIAL_BAGS_COUNT).map(([id, bagsCount]) => ({
		id: id as BloodType,
		bagsCount,
		minThreshold: MIN_THRESHOLD,
	}))

	await db.insert(bloodBank).values(rows).onConflictDoNothing()

	console.log(`✅ Seeded blood bank: ${rows.length} blood types`)
}

async function seed() {
	await seedAdmin()
	await seedBloodBank()
}

seed()
	.then(async () => {
		await db.$client.end()
		process.exit(0)
	})
	.catch(async (error) => {
		console.error("❌ Seed failed:", error)
		await db.$client.end()
		process.exit(1)
	})
