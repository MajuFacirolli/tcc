import type { TFactory } from "@/core/Factory"
import { GetMetricsQuery } from "@/data/queries/GetMetricsQuery"
import type { IGetMetricsQuery } from "@/domain/queries/IGetMetricsQuery"

export const createGetMetricsQuery: TFactory<IGetMetricsQuery> = () => {
	return new GetMetricsQuery()
}
