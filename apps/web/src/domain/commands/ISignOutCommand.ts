import type { ICommand } from "@/core/Command"
import type { TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"

export interface ISignOutCommand
	extends ICommand<void, TEither<TApplicationError, null>> {}
