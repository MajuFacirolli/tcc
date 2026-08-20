import { MetricsPeriodEnum } from "@/presentation/enums/MetricsPeriodEnum"

export const METRICS_PERIOD_LABELS: Record<MetricsPeriodEnum, string> = {
	[MetricsPeriodEnum.WEEK]: "Semana",
	[MetricsPeriodEnum.MONTH]: "Mês",
	[MetricsPeriodEnum.YEAR]: "Ano",
}
