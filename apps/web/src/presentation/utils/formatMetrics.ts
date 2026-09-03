import { MetricsPeriodEnum } from "../enums/MetricsPeriodEnum"

const WEEKDAY = new Intl.DateTimeFormat("pt-BR", {
	weekday: "short",
	timeZone: "UTC",
})
const DAY = new Intl.DateTimeFormat("pt-BR", {
	day: "2-digit",
	timeZone: "UTC",
})
const MONTH = new Intl.DateTimeFormat("pt-BR", {
	month: "short",
	timeZone: "UTC",
})

const FULL_DATE = new Intl.DateTimeFormat("pt-BR", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
	timeZone: "UTC",
})

const capitalize = (value: string) =>
	value.charAt(0).toUpperCase() + value.slice(1)

const stripPunctuation = (value: string) => value.replace(/\.$/, "")

/**
 * Bucket boundaries are UTC instants, so they are formatted in UTC — reading them in
 * the browser's zone would shift a midnight bucket into the previous day.
 */
export const formatBucketLabel = (
	bucketStart: Date,
	period: MetricsPeriodEnum,
) => {
	if (period === MetricsPeriodEnum.YEAR)
		return capitalize(stripPunctuation(MONTH.format(bucketStart)))

	if (period === MetricsPeriodEnum.MONTH) return DAY.format(bucketStart)

	return capitalize(stripPunctuation(WEEKDAY.format(bucketStart)))
}

const SECONDS_PER_MINUTE = 60
const SECONDS_PER_HOUR = 3600

/** The API reports response time in seconds; hours only read well above an hour. */
export const formatResponseTime = (seconds: number) => {
	if (seconds <= 0) return "—"

	if (seconds < SECONDS_PER_HOUR)
		return `${Math.round(seconds / SECONDS_PER_MINUTE)} min`

	return `${(seconds / SECONDS_PER_HOUR).toLocaleString("pt-BR", {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	})} h`
}

export const formatInteger = (value: number) => value.toLocaleString("pt-BR")

/**
 * A ratio between two rates, e.g. "3,2x". Distinct from `formatPercent` on purpose:
 * a segmented campaign converting 3,2 times better is not the same statement as one
 * converting 320% better, and the two are easy to conflate.
 */
export const formatMultiplier = (value: number) =>
	`${value.toLocaleString("pt-BR", {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	})}x`

/** Percentage points, for a difference between two percentages. */
export const formatPoints = (value: number) =>
	`${value.toLocaleString("pt-BR", {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	})} p.p.`

export const formatPercent = (value: number, fractionDigits = 1) =>
	`${value.toLocaleString("pt-BR", {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
	})}%`

export const formatPeriodRange = (from: Date, to: Date) => {
	const lastIncludedDay = new Date(to.getTime() - 1)

	return `${FULL_DATE.format(from)} - ${FULL_DATE.format(lastIncludedDay)}`
}
