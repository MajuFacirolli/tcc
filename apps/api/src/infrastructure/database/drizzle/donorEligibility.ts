import { sql } from "drizzle-orm"
import { donors } from "@infrastructure/database/drizzle/schema/index"
import { ELIGIBILITY_DAYS } from "@domain/rules/donorEligibility"

/**
 * The SQL counterpart of `isDonorEligible`, for filtering and counting donors
 * without loading them. Built from `ELIGIBILITY_DAYS`, so a new `Sex` extends the
 * `case` automatically.
 *
 * The `::int` cast is required: the bound day counts arrive as untyped parameters
 * that Postgres infers as `text`, and `text * interval` has no operator.
 */
const eligibilityThresholdDays = sql`(case ${sql.join(
	Object.entries(ELIGIBILITY_DAYS).map(
		([sex, days]) => sql`when ${donors.sex} = ${sex} then ${days}`,
	),
	sql` `,
)} end)::int`

export const donorEligibilitySql = sql`(
	${donors.lastDonationDate} is null
	or ${donors.lastDonationDate} <= now() - (${eligibilityThresholdDays} * interval '1 day')
)`
