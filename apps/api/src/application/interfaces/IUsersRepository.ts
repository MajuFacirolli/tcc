import type { User } from "@domain/entities/User"

export interface IUsersRepository {
	findByEmail(email: string): Promise<User | null>
	findById(id: string): Promise<User | null>
}
