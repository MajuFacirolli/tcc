export const MS_PER_DAY = 1000 * 60 * 60 * 24

export const MS_PER_SECOND = 1000

export function addDays(date: Date, days: number): Date {
	const result = new Date(date)
	result.setUTCDate(result.getUTCDate() + days)
	return result
}

export function startOfDay(date: Date): Date {
	const result = new Date(date)
	result.setUTCHours(0, 0, 0, 0)
	return result
}

export function parseUtcTimestamp(value: unknown): Date {
	if (value instanceof Date) return value
	return new Date(`${String(value).replace(" ", "T")}Z`)
}
