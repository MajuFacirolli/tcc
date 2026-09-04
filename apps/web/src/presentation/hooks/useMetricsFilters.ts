import { parseAsStringEnum, useQueryStates } from "nuqs"
import {
	METRICS_PERIODS,
	MetricsPeriodEnum,
} from "@/presentation/enums/MetricsPeriodEnum"

const metricsParsers = {
	period: parseAsStringEnum<MetricsPeriodEnum>([
		...METRICS_PERIODS,
	]).withDefault(MetricsPeriodEnum.WEEK),
}

export const useMetricsFilters = () => {
	const [params, setParams] = useQueryStates(metricsParsers, {
		history: "push",
	})

	const setPeriod = (period: MetricsPeriodEnum) => setParams({ period })

	return { period: params.period, setPeriod }
}
