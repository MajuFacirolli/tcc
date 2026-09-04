import { createGetMetricsQuery } from "@/factories/createGetMetricsQuery"
import { QUERY_KEYS } from "../data/queryKeys"
import { useFetch } from "./useFetch"

const getMetricsQuery = createGetMetricsQuery()

export const useMetrics = () => {
	const { data, isLoading, error, refetch } = useFetch({
		queryKeys: [QUERY_KEYS.METRICS],
		queryFn: async () => await getMetricsQuery.execute(),
	})

	return { metrics: data, isLoading, error, refetch }
}
