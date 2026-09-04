import { left, right, type TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type { IGetProfileQuery } from "@/domain/queries/IGetProfileQuery"
import type { ProfileResponse } from "../models/responses/ProfileResponse"
import { client } from "../modules/client"
import type { IApiResponse } from "../modules/client/types/IApiResponse"
import { parseError } from "@/utils/parseError"

export class GetProfileQuery implements IGetProfileQuery {
	async execute(): Promise<TEither<TApplicationError, ProfileResponse>> {
		try {
			const { data } =
				await client<IApiResponse<ProfileResponse>>("/auth/profile")

			return right(data.data)
		} catch (error) {
			return left(parseError(error))
		}
	}
}
