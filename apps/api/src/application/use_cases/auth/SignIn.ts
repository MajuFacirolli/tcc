import type { SignInInput } from "@/application/dtos/auth/SignInInput"
import { UnauthorizedError } from "@/core/errors/UnauthorizedError"
import type { IPasswordHasher } from "@application/interfaces/IPasswordHasher"
import type { IUsersRepository } from "@application/interfaces/IUsersRepository"
import type { User } from "@domain/entities/User"

export class SignInUseCase {
	constructor(
		private readonly usersRepository: IUsersRepository,
		private readonly passwordHasher: IPasswordHasher,
	) {}

	async execute(input: SignInInput): Promise<User> {
		const email = input.email.trim().toLowerCase()
		const user = await this.usersRepository.findByEmail(email)

		if (!user) {
			throw new UnauthorizedError("Invalid credentials")
		}

		const isValid = await this.passwordHasher.verify(
			user.passwordHash,
			input.password,
		)

		if (!isValid) throw new UnauthorizedError("Invalid credentials")

		return user
	}
}
