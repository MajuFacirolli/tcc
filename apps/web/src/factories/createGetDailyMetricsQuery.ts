import type { TFactory } from "@/core/Factory"
import { GetDailyMetricsQuery } from "@/data/queries/GetDailyMetricsQuery"
import type { IGetDailyMetricsQuery } from "@/domain/queries/IGetDailyMetricsQuery"

export const createGetDailyMetricsQuery: TFactory<
	IGetDailyMetricsQuery
> = () => {
	return new GetDailyMetricsQuery()
}
