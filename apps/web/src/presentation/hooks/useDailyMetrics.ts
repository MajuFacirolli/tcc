import { keepPreviousData } from "@tanstack/react-query"
import { createGetDailyMetricsQuery } from "@/factories/createGetDailyMetricsQuery"
import type { DailyMetricsVM } from "@/domain/viewmodels/DailyMetricsVM"
import { useFetch } from "./useFetch"
import { QUERY_KEYS } from "../data/queryKeys"

const getDailyMetricsQuery = createGetDailyMetricsQuery()

export const useDailyMetrics = () => {
	const { data, error, isLoading, isFetching } = useFetch<DailyMetricsVM>({
		queryKeys: [QUERY_KEYS.DAILY_METRICS],
		queryFn: async () => await getDailyMetricsQuery.execute(),
		placeholderData: keepPreviousData,
	})

	return { dailyMetrics: data, error, isLoading, isFetching }
}
