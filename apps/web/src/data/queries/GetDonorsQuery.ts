import { left, right, type TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type {
	IGetDonorsQuery,
	IGetDonorsQueryExecuteParams,
} from "@/domain/queries/IGetDonorsQuery"
import { client } from "../modules/client"
import type { IApiResponse } from "../modules/client/types/IApiResponse"
import { parseError } from "@/utils/parseError"
import { DonorVM } from "@/domain/viewmodels/DonorVM"
import { DonorResponse } from "../models/responses/DonorResponse"
import { mapper } from "../mappers/mapper"
import type { IPagedList } from "@/core/PagedList"
import { stringifyQuery } from "@/utils/stringifyQuery"

export class GetDonorsQuery implements IGetDonorsQuery {
	async execute(
		params: IGetDonorsQueryExecuteParams,
	): Promise<TEither<TApplicationError, IPagedList<DonorVM>>> {
		try {
			const { data } = await client<IApiResponse<IPagedList<DonorResponse>>>(
				`/donors?${stringifyQuery(params, { skipNulls: true })}`,
			)

			const mappedData = mapper.mapArray(
				data.data.items,
				DonorResponse,
				DonorVM,
			)

			return right({ ...data.data, items: mappedData })
		} catch (error) {
			return left(parseError(error))
		}
	}
}
