import { left, right, type TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type {
	IConfirmDonationIntentionCommand,
	IConfirmDonationIntentionExecuteParams,
} from "@/domain/commands/IConfirmDonationIntentionCommand"
import { ConfirmationVM } from "@/domain/viewmodels/ConfirmationVM"
import { parseError } from "@/utils/parseError"
import { client } from "../modules/client"
import type { IApiResponse } from "../modules/client/types/IApiResponse"
import { ConfirmationResponse } from "../models/responses/ConfirmationResponse"
import { HttpMethodsEnum } from "../modules/client/types/HttpMethodsEnum"
import { mapper } from "../mappers/mapper"

export class ConfirmDonationIntentionCommand
	implements IConfirmDonationIntentionCommand
{
	async execute(
		params: IConfirmDonationIntentionExecuteParams,
	): Promise<TEither<TApplicationError, ConfirmationVM>> {
		try {
			const { data } = await client<IApiResponse<ConfirmationResponse>>(
				`/confirmations/${params.token}`,
				{ method: HttpMethodsEnum.POST },
			)

			const mappedData = mapper.map(
				data.data,
				ConfirmationResponse,
				ConfirmationVM,
			)
			return right(mappedData)
		} catch (error) {
			return left(parseError(error))
		}
	}
}
