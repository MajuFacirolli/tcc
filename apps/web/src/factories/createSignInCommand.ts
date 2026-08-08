import type { TFactory } from "@/core/Factory"
import { SignInCommand } from "@/data/commands/SignInCommand"
import type { ISignInCommand } from "@/domain/commands/ISignInCommand"

export const createSignInCommand: TFactory<ISignInCommand> = () => {
	return new SignInCommand()
}
