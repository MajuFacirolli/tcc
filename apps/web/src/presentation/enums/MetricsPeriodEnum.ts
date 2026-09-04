export const MetricsPeriodEnum = {
	WEEK: "week",
	MONTH: "month",
	YEAR: "year",
} as const

export type MetricsPeriodEnum =
	(typeof MetricsPeriodEnum)[keyof typeof MetricsPeriodEnum]

export const METRICS_PERIODS = Object.values(MetricsPeriodEnum)
