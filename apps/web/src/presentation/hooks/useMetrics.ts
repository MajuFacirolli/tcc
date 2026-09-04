import { keepPreviousData } from "@tanstack/react-query"
import { createGetMetricsQuery } from "@/factories/createGetMetricsQuery"
import type { MetricsPeriodEnum } from "../enums/MetricsPeriodEnum"
import { QUERY_KEYS } from "../data/queryKeys"
import { useFetch } from "./useFetch"

const getMetricsQuery = createGetMetricsQuery()

export const useMetrics = (period: MetricsPeriodEnum) => {
	const { data, isLoading, isFetching, error, refetch } = useFetch({
		queryKeys: [QUERY_KEYS.METRICS, period],
		queryFn: async () => await getMetricsQuery.execute({ period }),
		placeholderData: keepPreviousData,
	})

	return { metrics: data, isLoading, isFetching, error, refetch }
}
