import { left, right, type TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type { IGetDailyMetricsQuery } from "@/domain/queries/IGetDailyMetricsQuery"
import { DailyMetricsVM } from "@/domain/viewmodels/DailyMetricsVM"
import { parseError } from "@/utils/parseError"
import { client } from "../modules/client"
import type { IApiResponse } from "../modules/client/types/IApiResponse"
import { DailyMetricsResponse } from "../models/responses/DailyMetricsResponse"
import { mapper } from "../mappers/mapper"

export class GetDailyMetricsQuery implements IGetDailyMetricsQuery {
	async execute(): Promise<TEither<TApplicationError, DailyMetricsVM>> {
		try {
			const { data } =
				await client<IApiResponse<DailyMetricsResponse>>("/metrics/daily")

			const mappedData = mapper.map(
				data.data,
				DailyMetricsResponse,
				DailyMetricsVM,
			)

			return right(mappedData)
		} catch (error) {
			return left(parseError(error))
		}
	}
}
