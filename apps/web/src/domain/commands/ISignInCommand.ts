import type { ICommand } from "@/core/Command"
import type { TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type { ProfileResponse } from "@/data/models/responses/ProfileResponse"

export interface ISignInCommandExecuteParams {
	email: string
	password: string
}

export interface ISignInCommand
	extends ICommand<
		ISignInCommandExecuteParams,
		TEither<TApplicationError, ProfileResponse>
	> {}
