import type { ICommand } from "@/core/Command"
import type { TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type { ConfirmationVM } from "../viewmodels/ConfirmationVM"

export type IConfirmDonationIntentionExecuteParams = {
	token: string
}

export interface IConfirmDonationIntentionCommand
	extends ICommand<
		IConfirmDonationIntentionExecuteParams,
		TEither<TApplicationError, ConfirmationVM>
	> {}
