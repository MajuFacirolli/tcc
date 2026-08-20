export const METRICS_PERIODS = ["week", "month", "year"] as const

export type MetricsPeriod = (typeof METRICS_PERIODS)[number]
