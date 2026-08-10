import { left, right, type TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type {
	ICreateCampaignCommand,
	ICreateCampaignCommandExecuteParams,
} from "@/domain/commands/ICreateCampaignCommand"
import { parseError } from "@/utils/parseError"
import { client } from "../modules/client"
import type { IApiResponse } from "../modules/client/types/IApiResponse"
import { HttpMethodsEnum } from "../modules/client/types/HttpMethodsEnum"

export class CreateCampaignCommand implements ICreateCampaignCommand {
	async execute(
		params: ICreateCampaignCommandExecuteParams,
	): Promise<TEither<TApplicationError, string>> {
		try {
			const { data } = await client<IApiResponse<string>>("/campaigns", {
				method: HttpMethodsEnum.POST,
				body: JSON.stringify(params),
			})

			return right(data.data)
		} catch (error) {
			return left(parseError(error))
		}
	}
}
