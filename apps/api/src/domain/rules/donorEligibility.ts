import type { Sex } from "@domain/value_objects/Sex"
import { MS_PER_DAY } from "@domain/utils/dateUtils"

/**
 * Single source of truth for donor eligibility: the minimum interval, per sex,
 * between one donation and the next.
 *
 * The rule is expressed twice on purpose — once here in TypeScript, for entities
 * already loaded in memory, and once in SQL (see `donorEligibilitySql`) so it can
 * also be filtered and counted in the database. Both read these same thresholds,
 * so changing a number here changes every caller.
 */
export const ELIGIBILITY_DAYS: Record<Sex, number> = {
	male: 60,
	female: 90,
}

export function isDonorEligible(
	sex: Sex,
	lastDonationDate: Date | null,
	now: Date = new Date(),
): boolean {
	if (!lastDonationDate) return true

	const days = Math.floor(
		(now.getTime() - lastDonationDate.getTime()) / MS_PER_DAY,
	)

	return days >= ELIGIBILITY_DAYS[sex]
}
