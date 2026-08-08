import type { TFactory } from "@/core/Factory"
import { SignOutCommand } from "@/data/commands/SignOutCommand"
import type { ISignOutCommand } from "@/domain/commands/ISignOutCommand"

export const createSignOutCommand: TFactory<ISignOutCommand> = () => {
	return new SignOutCommand()
}
