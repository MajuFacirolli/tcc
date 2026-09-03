import type { ICommand } from "@/core/Command"
import type { TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type { BloodTypeEnum } from "../enums/BloodTypeEnum"
import type { CampaignKindEnum } from "../enums/CampaignKindEnum"

export interface ICreateCampaignCommandExecuteParams {
	title: string
	message: string
	kind: CampaignKindEnum
	bloodType: BloodTypeEnum | null
}

export interface ICreateCampaignCommand
	extends ICommand<
		ICreateCampaignCommandExecuteParams,
		TEither<TApplicationError, string>
	> {}
