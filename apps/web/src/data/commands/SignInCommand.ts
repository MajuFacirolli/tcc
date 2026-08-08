import { left, right, type TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type {
	ISignInCommand,
	ISignInCommandExecuteParams,
} from "@/domain/commands/ISignInCommand"
import type { ProfileResponse } from "../models/responses/ProfileResponse"
import { client } from "../modules/client"
import { HttpMethodsEnum } from "../modules/client/types/HttpMethodsEnum"
import type { IApiResponse } from "../modules/client/types/IApiResponse"
import { parseError } from "@/utils/parseError"

export class SignInCommand implements ISignInCommand {
	async execute(
		params: ISignInCommandExecuteParams,
	): Promise<TEither<TApplicationError, ProfileResponse>> {
		try {
			const { data } = await client<IApiResponse<ProfileResponse>>(
				"/auth/sign-in",
				{
					method: HttpMethodsEnum.POST,
					body: JSON.stringify(params),
				},
			)

			const profile = data.data

			return right(profile)
		} catch (error) {
			return left(parseError(error))
		}
	}
}
