import { eq, sql } from "drizzle-orm"
import { db } from "@infrastructure/database/drizzle/client"
import {
	campaigns,
	confirmations,
	donors,
} from "@infrastructure/database/drizzle/schema/index"
import { ELIGIBILITY_DAYS } from "@domain/entities/Donor"
import type { MetricsGranularity } from "@domain/utils/metricsWindow"
import type {
	IMetricsRepository,
	IMetricsRepositoryWindow,
	MetricsBloodTypeRow,
	MetricsBucketRow,
	MetricsWindowTotals,
} from "@application/interfaces/IMetricsRepository"
import { parseUtcTimestamp } from "@/domain/utils/dateUtils"

const GRANULARITY_SQL: Record<
	MetricsGranularity,
	{ unit: string; interval: string }
> = {
	day: { unit: "day", interval: "1 day" },
	month: { unit: "month", interval: "1 month" },
}

/**
 * Mirrors `Donor.isEligible`, built from the exported domain thresholds.
 * The `::int` cast is required: the bound day counts arrive as untyped parameters
 * that Postgres infers as `text`, and `text * interval` has no operator.
 */
const eligibilityThresholdDays = sql`(case ${sql.join(
	Object.entries(ELIGIBILITY_DAYS).map(
		([sex, days]) => sql`when ${donors.sex} = ${sex} then ${days}`,
	),
	sql` `,
)} end)::int`

const isEligible = sql`(
	${donors.lastDonationDate} is null
	or ${donors.lastDonationDate} <= now() - (${eligibilityThresholdDays} * interval '1 day')
)`

const responseTimeSeconds = sql`extract(epoch from (${confirmations.confirmedAt} - ${confirmations.createdAt}))`

function toNumber(value: unknown): number {
	return Number(value ?? 0)
}

function toNullableNumber(value: unknown): number | null {
	return value === null || value === undefined ? null : Number(value)
}

/**
 * Binds a window boundary as a UTC wall-clock literal.
 *
 * `timestamp` columns carry no zone, and parameter encoding differs by entry point:
 * the query builder sends a Date as an ISO string, but `db.execute` hands the Date
 * straight to node-pg, which serializes it in *Node's* local zone — and `::timestamp`
 * then drops the offset, shifting the boundary by the local UTC offset. Formatting the
 * value explicitly removes both the ambiguity and the shift, and keeps the year spine
 * anchored to a real month start so `generate_series` can't step off it.
 */
function utcLiteral(date: Date) {
	return sql`${date.toISOString().slice(0, 19).replace("T", " ")}::timestamp`
}

export class DrizzleMetricsRepository implements IMetricsRepository {
	async countEligibleDonors(): Promise<number> {
		const [row] = await db
			.select({ total: sql<number>`count(*) filter (where ${isEligible})` })
			.from(donors)

		return toNumber(row?.total)
	}

	async getWindowTotals(
		current: IMetricsRepositoryWindow,
		previous: IMetricsRepositoryWindow,
	): Promise<{ current: MetricsWindowTotals; previous: MetricsWindowTotals }> {
		// Both windows in one round trip: `filter` scopes each aggregate independently,
		// so the scan happens once.
		const notifiedIn = ({ from, to }: IMetricsRepositoryWindow) =>
			sql`count(*) filter (where ${confirmations.createdAt} >= ${utcLiteral(from)} and ${confirmations.createdAt} < ${utcLiteral(to)})`

		const confirmedIn = ({ from, to }: IMetricsRepositoryWindow) =>
			sql`count(*) filter (where ${confirmations.confirmedAt} >= ${utcLiteral(from)} and ${confirmations.confirmedAt} < ${utcLiteral(to)})`

		const avgResponseIn = ({ from, to }: IMetricsRepositoryWindow) =>
			sql`avg(${responseTimeSeconds}) filter (where ${confirmations.confirmedAt} >= ${utcLiteral(from)} and ${confirmations.confirmedAt} < ${utcLiteral(to)})`

		const [row] = await db
			.select({
				currentNotified: sql<number>`${notifiedIn(current)}`,
				currentConfirmed: sql<number>`${confirmedIn(current)}`,
				currentAverage: sql<number | null>`${avgResponseIn(current)}`,
				previousNotified: sql<number>`${notifiedIn(previous)}`,
				previousConfirmed: sql<number>`${confirmedIn(previous)}`,
				previousAverage: sql<number | null>`${avgResponseIn(previous)}`,
			})
			.from(confirmations)

		return {
			current: {
				notifiedCount: toNumber(row?.currentNotified),
				confirmationsCount: toNumber(row?.currentConfirmed),
				averageResponseTime: toNullableNumber(row?.currentAverage),
			},
			previous: {
				notifiedCount: toNumber(row?.previousNotified),
				confirmationsCount: toNumber(row?.previousConfirmed),
				averageResponseTime: toNullableNumber(row?.previousAverage),
			},
		}
	}

	async sumEligibleReached({
		from,
		to,
	}: IMetricsRepositoryWindow): Promise<number> {
		const [row] = await db
			.select({
				total: sql<number>`coalesce(sum(${campaigns.totalEligibleDonors}), 0)`,
			})
			.from(campaigns)
			.where(
				sql`${campaigns.createdAt} >= ${utcLiteral(from)} and ${campaigns.createdAt} < ${utcLiteral(to)}`,
			)

		return toNumber(row?.total)
	}

	async getBuckets(
		{ from, to }: IMetricsRepositoryWindow,
		granularity: MetricsGranularity,
	): Promise<MetricsBucketRow[]> {
		const { unit, interval } = GRANULARITY_SQL[granularity]

		// The generate_series spine is what guarantees a continuous x-axis: a plain
		// GROUP BY would omit empty buckets and the chart would silently skip days.
		// Each side is pre-aggregated to one row per bucket, so the joins can't fan out.
		const result = await db.execute(sql`
			with spine as (
				select generate_series(
					${utcLiteral(from)},
					${utcLiteral(to)} - interval ${sql.raw(`'${interval}'`)},
					interval ${sql.raw(`'${interval}'`)}
				) as bucket_start
			),
			notified as (
				select date_trunc(${unit}, ${confirmations.createdAt}) as bucket_start,
					count(*) as total
				from ${confirmations}
				where ${confirmations.createdAt} >= ${utcLiteral(from)}
					and ${confirmations.createdAt} < ${utcLiteral(to)}
				group by 1
			),
			confirmed as (
				select date_trunc(${unit}, ${confirmations.confirmedAt}) as bucket_start,
					count(*) as total,
					avg(${responseTimeSeconds}) as average_response_time
				from ${confirmations}
				where ${confirmations.confirmedAt} >= ${utcLiteral(from)}
					and ${confirmations.confirmedAt} < ${utcLiteral(to)}
				group by 1
			)
			select
				spine.bucket_start,
				coalesce(notified.total, 0) as notified_count,
				coalesce(confirmed.total, 0) as confirmations_count,
				confirmed.average_response_time
			from spine
			left join notified on notified.bucket_start = spine.bucket_start
			left join confirmed on confirmed.bucket_start = spine.bucket_start
			order by spine.bucket_start
		`)

		return result.rows.map((row) => {
			const bucket = row as Record<string, unknown>
			return {
				bucketStart: parseUtcTimestamp(bucket.bucket_start),
				notifiedCount: toNumber(bucket.notified_count),
				confirmationsCount: toNumber(bucket.confirmations_count),
				averageResponseTime: toNullableNumber(bucket.average_response_time),
			}
		})
	}

	async getConfirmationsByBloodType({
		from,
		to,
	}: IMetricsRepositoryWindow): Promise<MetricsBloodTypeRow[]> {
		const rows = await db
			.select({
				bloodType: campaigns.bloodType,
				confirmations: sql<number>`count(*)`,
			})
			.from(confirmations)
			.innerJoin(campaigns, eq(campaigns.id, confirmations.campaignId))
			.where(
				sql`${confirmations.confirmedAt} >= ${utcLiteral(from)} and ${confirmations.confirmedAt} < ${utcLiteral(to)}`,
			)
			.groupBy(campaigns.bloodType)

		return rows.map((row) => ({
			bloodType: row.bloodType,
			confirmations: toNumber(row.confirmations),
		}))
	}
}
