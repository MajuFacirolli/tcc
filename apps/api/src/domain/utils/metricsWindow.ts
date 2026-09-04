import { addDays, startOfDay } from "./dateUtils"

/**
 * The page reports on one fixed rolling window, so every panel shares a period by
 * construction and there is no filter that could put two of them on different ranges.
 */
export const METRICS_WINDOW_DAYS = 30

/**
 * Cut-offs for the response-speed curve, in hours. Cumulative: each is "answered
 * within this long", which is the form the question takes when staffing a shift.
 */
export const RESPONSE_SPEED_HOURS = [2, 6, 12, 24, 48] as const

export interface MetricsWindow {
	from: Date
	/** Exclusive, and sitting at the next midnight, so today is included whole. */
	to: Date
	/** One bucket per day of the window. */
	bucketCount: number
}

export function resolveMetricsWindow(now: Date = new Date()): MetricsWindow {
	const to = startOfDay(addDays(now, 1))

	return {
		from: addDays(to, -METRICS_WINDOW_DAYS),
		to,
		bucketCount: METRICS_WINDOW_DAYS,
	}
}
