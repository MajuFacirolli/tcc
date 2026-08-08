import "reflect-metadata"
import { env } from "@/env"
import { Argon2PasswordHasher } from "@infrastructure/identity/Argon2PasswordHasher"
import { db } from "./client"
import { users } from "./schema/index"

async function seed() {
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
