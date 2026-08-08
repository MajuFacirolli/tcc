import { hash, verify } from "@node-rs/argon2"
import type { IPasswordHasher } from "@application/interfaces/IPasswordHasher"

export class Argon2PasswordHasher implements IPasswordHasher {
	async hash(plain: string): Promise<string> {
		return hash(plain, {
			memoryCost: 19456,
			timeCost: 2,
		})
	}

	async verify(hashed: string, plain: string): Promise<boolean> {
		try {
			return await verify(hashed, plain)
		} catch {
			return false
		}
	}
}
