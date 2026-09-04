import { eq } from "drizzle-orm"
import type { IUsersRepository } from "@application/interfaces/IUsersRepository"
import { User } from "@domain/entities/User"
import { db } from "@infrastructure/database/drizzle/client"
import { users } from "@infrastructure/database/drizzle/schema/index"

export class DrizzleUsersRepository implements IUsersRepository {
	private rowToUser(row: typeof users.$inferSelect): User {
		return new User(
			row.id,
			row.name,
			row.email,
			row.passwordHash,
			row.createdAt,
		)
	}

	async findByEmail(email: string): Promise<User | null> {
		const [row] = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1)

		return row ? this.rowToUser(row) : null
	}

	async findById(id: string): Promise<User | null> {
		const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1)

		return row ? this.rowToUser(row) : null
	}
}
