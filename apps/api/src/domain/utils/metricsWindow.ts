import type { MetricsPeriod } from "@domain/value_objects/MetricsPeriod"
import {
	addDays,
	addMonths,
	startOfDay,
	startOfMonth,
	YEAR_MONTHS,
} from "./dateUtils"

export type MetricsGranularity = "day" | "month"

export interface MetricsWindow {
	from: Date
	to: Date
	previousFrom: Date
	previousTo: Date
	granularity: MetricsGranularity
	bucketCount: number
}

const WINDOW_DAYS: Record<Exclude<MetricsPeriod, "year">, number> = {
	week: 7,
	month: 30,
}

export function resolveMetricsWindow(
	period: MetricsPeriod,
	now: Date = new Date(),
): MetricsWindow {
	if (period === "year") {
		const to = startOfMonth(addMonths(now, 1))
		const from = addMonths(to, -YEAR_MONTHS)

		return {
			from,
			to,
			previousFrom: addMonths(from, -YEAR_MONTHS),
			previousTo: from,
			granularity: "month",
			bucketCount: YEAR_MONTHS,
		}
	}

	const days = WINDOW_DAYS[period]
	const to = startOfDay(addDays(now, 1))
	const from = addDays(to, -days)

	return {
		from,
		to,
		previousFrom: addDays(from, -days),
		previousTo: from,
		granularity: "day",
		bucketCount: days,
	}
}

export function percentDelta(current: number, previous: number): number {
	if (previous === 0) return 0
	return ((current - previous) / previous) * 100
}
