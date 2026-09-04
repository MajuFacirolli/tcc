import { left, right, type TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type {
	ICountEligibleDonorsQuery,
	ICountEligibleDonorsQueryExecuteParams,
} from "@/domain/queries/ICountEligibleDonorsQuery"
import { client } from "../modules/client"
import type { IApiResponse } from "../modules/client/types/IApiResponse"
import { parseError } from "@/utils/parseError"
import { stringifyQuery } from "@/utils/stringifyQuery"

export class CountEligibleDonorsQuery implements ICountEligibleDonorsQuery {
	async execute(
		params: ICountEligibleDonorsQueryExecuteParams,
	): Promise<TEither<TApplicationError, number>> {
		try {
			const { data } = await client<IApiResponse<{ total: number }>>(
				`/donors/eligible-count?${stringifyQuery(params)}`,
			)

			return right(data.data.total)
		} catch (error) {
			return left(parseError(error))
		}
	}
}
