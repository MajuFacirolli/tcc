const SHORT_DATE = new Intl.DateTimeFormat("pt-BR", {
	day: "2-digit",
	month: "2-digit",
	timeZone: "UTC",
})

const FULL_DATE = new Intl.DateTimeFormat("pt-BR", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
	timeZone: "UTC",
})

/**
 * Bucket boundaries are UTC instants, so they are formatted in UTC — reading them in
 * the browser's zone would shift a midnight bucket into the previous day. The month is
 * kept because a 30-day window straddles two of them and a bare day number would repeat.
 */
export const formatBucketLabel = (bucketStart: Date) =>
	SHORT_DATE.format(bucketStart)

export const formatDate = (date: Date) => FULL_DATE.format(date)

export const formatPeriodRange = (from: Date, to: Date) =>
	`${FULL_DATE.format(from)} - ${FULL_DATE.format(new Date(to.getTime() - 1))}`

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

/** A bag balance reads as a direction, so the sign is always shown. */
export const formatSigned = (value: number) =>
	`${value > 0 ? "+" : ""}${value.toLocaleString("pt-BR")}`

export const formatPercent = (value: number, fractionDigits = 1) =>
	`${value.toLocaleString("pt-BR", {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
	})}%`

/** Percentage points, for a difference between two percentages. */
export const formatPoints = (value: number) =>
	`${value > 0 ? "+" : ""}${value.toLocaleString("pt-BR", {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	})} p.p.`

/** Cumulative cut-offs read as "até 6 h". */
export const formatHours = (hours: number) => `${hours} h`
