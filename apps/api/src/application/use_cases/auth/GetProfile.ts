import { UnauthorizedError } from "@/core/errors/UnauthorizedError"
import type { IUsersRepository } from "@application/interfaces/IUsersRepository"
import type { User } from "@domain/entities/User"

export class GetProfileUseCase {
	constructor(private readonly usersRepository: IUsersRepository) {}

	async execute(userId: string): Promise<User> {
		const user = await this.usersRepository.findById(userId)

		if (!user) throw new UnauthorizedError("Authentication required")

		return user
	}
}
