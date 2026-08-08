import { left, right, type TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type { ISignOutCommand } from "@/domain/commands/ISignOutCommand"
import { client } from "../modules/client"
import { HttpMethodsEnum } from "../modules/client/types/HttpMethodsEnum"
import type { IApiResponse } from "../modules/client/types/IApiResponse"
import { parseError } from "@/utils/parseError"

export class SignOutCommand implements ISignOutCommand {
	async execute(): Promise<TEither<TApplicationError, null>> {
		try {
			const { data } = await client<IApiResponse<null>>("/auth/sign-out", {
				method: HttpMethodsEnum.POST,
			})

			return right(data.data)
		} catch (error) {
			return left(parseError(error))
		}
	}
}
