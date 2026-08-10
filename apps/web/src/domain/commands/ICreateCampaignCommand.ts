import type { ICommand } from "@/core/Command"
import type { TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type { BloodTypeEnum } from "../enums/BloodTypeEnum"

export interface ICreateCampaignCommandExecuteParams {
	title: string
	message: string
	bloodType: BloodTypeEnum
}

export interface ICreateCampaignCommand
	extends ICommand<
		ICreateCampaignCommandExecuteParams,
		TEither<TApplicationError, string>
	> {}
