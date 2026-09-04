import { and, eq, sql } from "drizzle-orm"
import { db } from "@infrastructure/database/drizzle/client"
import {
	campaigns,
	confirmations,
	donors,
} from "@infrastructure/database/drizzle/schema/index"
import { donorEligibilitySql } from "@infrastructure/database/drizzle/donorEligibility"
import type {
	DailyMetricsRow,
	IMetricsRepository,
	IMetricsRepositoryWindow,
	MetricsBloodTypeRow,
	MetricsBucketRow,
	MetricsKindRow,
} from "@application/interfaces/IMetricsRepository"
import type { CampaignKind } from "@domain/value_objects/CampaignKind"
import { parseUtcTimestamp } from "@/domain/utils/dateUtils"

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
 * value explicitly removes both the ambiguity and the shift, and keeps the day spine
 * anchored to a real midnight so `generate_series` can't step off it.
 */
function utcLiteral(date: Date) {
	return sql`${date.toISOString().slice(0, 19).replace("T", " ")}::timestamp`
}

/**
 * The one scoping rule the whole metrics page is built on: a campaign belongs whole to
 * the window it was created in, and so does every notification and confirmation it
 * produced. Because a confirmation is always issued after its campaign and answered
 * before now, every timestamp involved falls inside the window too — which is what lets
 * the daily series and the blood-type breakdown add up to the totals exactly.
 */
function campaignCreatedIn({ from, to }: IMetricsRepositoryWindow) {
	return sql`${campaigns.createdAt} >= ${utcLiteral(from)} and ${campaigns.createdAt} < ${utcLiteral(to)}`
}

export class DrizzleMetricsRepository implements IMetricsRepository {
	async countEligibleDonors(): Promise<number> {
		const [row] = await db
			.select({
				total: sql<number>`count(*) filter (where ${donorEligibilitySql})`,
			})
			.from(donors)

		return toNumber(row?.total)
	}

	/**
	 * Two aggregates, merged by kind: volumes counted off the notification rows, and
	 * `eligibleReached` off the campaign rows, which is the only place the audience's
	 * eligibility at send time was recorded.
	 */
	async getComparisonByKind(
		window: IMetricsRepositoryWindow,
	): Promise<MetricsKindRow[]> {
		const createdInWindow = campaignCreatedIn(window)

		const [campaignTotals, notificationTotals] = await Promise.all([
			db
				.select({
					kind: campaigns.kind,
					campaignsCount: sql<number>`count(*)`,
					eligibleReached: sql<number>`coalesce(sum(${campaigns.totalEligibleDonors}), 0)`,
				})
				.from(campaigns)
				.where(createdInWindow)
				.groupBy(campaigns.kind),
			db
				.select({
					kind: campaigns.kind,
					notifiedCount: sql<number>`count(*)`,
					confirmationsCount: sql<number>`count(${confirmations.confirmedAt})`,
					averageResponseTime: sql<
						number | null
					>`avg(${responseTimeSeconds}) filter (where ${confirmations.confirmedAt} is not null)`,
				})
				.from(confirmations)
				.innerJoin(campaigns, eq(campaigns.id, confirmations.campaignId))
				.where(createdInWindow)
				.groupBy(campaigns.kind),
		])

		const notificationsByKind = new Map(
			notificationTotals.map((row) => [row.kind, row]),
		)

		return campaignTotals.map((row) => {
			const notifications = notificationsByKind.get(row.kind as CampaignKind)

			return {
				kind: row.kind,
				campaignsCount: toNumber(row.campaignsCount),
				eligibleReached: toNumber(row.eligibleReached),
				notifiedCount: toNumber(notifications?.notifiedCount),
				confirmationsCount: toNumber(notifications?.confirmationsCount),
				averageResponseTime: toNullableNumber(
					notifications?.averageResponseTime,
				),
			}
		})
	}

	async getBuckets(
		window: IMetricsRepositoryWindow,
	): Promise<MetricsBucketRow[]> {
		const { from, to } = window
		const createdInWindow = campaignCreatedIn(window)

		// The generate_series spine is what guarantees a continuous x-axis: a plain
		// GROUP BY would omit empty days and the chart would silently skip them.
		// Each side is pre-aggregated to one row per day, so the joins can't fan out.
		const result = await db.execute(sql`
			with spine as (
				select generate_series(
					${utcLiteral(from)},
					${utcLiteral(to)} - interval '1 day',
					interval '1 day'
				) as bucket_start
			),
			notified as (
				select date_trunc('day', ${confirmations.createdAt}) as bucket_start,
					count(*) as total
				from ${confirmations}
				inner join ${campaigns} on ${campaigns.id} = ${confirmations.campaignId}
				where ${createdInWindow}
				group by 1
			),
			confirmed as (
				select date_trunc('day', ${confirmations.confirmedAt}) as bucket_start,
					count(*) as total
				from ${confirmations}
				inner join ${campaigns} on ${campaigns.id} = ${confirmations.campaignId}
				where ${createdInWindow}
					and ${confirmations.confirmedAt} is not null
				group by 1
			)
			select
				spine.bucket_start,
				coalesce(notified.total, 0) as notified_count,
				coalesce(confirmed.total, 0) as confirmations_count
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
			}
		})
	}

	/** By the donor's blood type: a generic campaign names none of its own. */
	async getConfirmationsByBloodType(
		window: IMetricsRepositoryWindow,
	): Promise<MetricsBloodTypeRow[]> {
		const rows = await db
			.select({
				bloodType: donors.bloodType,
				confirmations: sql<number>`count(*)`,
			})
			.from(confirmations)
			.innerJoin(campaigns, eq(campaigns.id, confirmations.campaignId))
			.innerJoin(donors, eq(donors.id, confirmations.donorId))
			.where(
				and(
					campaignCreatedIn(window),
					sql`${confirmations.confirmedAt} is not null`,
				),
			)
			.groupBy(donors.bloodType)

		return rows.map((row) => ({
			bloodType: row.bloodType,
			confirmations: toNumber(row.confirmations),
		}))
	}

	async getDailyMetrics({
		from,
		to,
	}: IMetricsRepositoryWindow): Promise<DailyMetricsRow> {
		const [donorRow, campaignRow, confirmationRow] = await Promise.all([
			db
				.select({
					registered: sql<number>`count(*)`,
					eligible: sql<number>`count(*) filter (where ${donorEligibilitySql})`,
				})
				.from(donors),
			db
				.select({
					active: sql<number>`count(*) filter (where ${campaigns.status} = 'active')`,
				})
				.from(campaigns),
			db
				.select({
					notified: sql<number>`count(*) filter (where ${confirmations.createdAt} >= ${utcLiteral(from)} and ${confirmations.createdAt} < ${utcLiteral(to)})`,
					confirmed: sql<number>`count(*) filter (where ${confirmations.confirmedAt} >= ${utcLiteral(from)} and ${confirmations.confirmedAt} < ${utcLiteral(to)})`,
				})
				.from(confirmations),
		])

		return {
			registeredDonors: toNumber(donorRow[0]?.registered),
			eligibleDonors: toNumber(donorRow[0]?.eligible),
			activeCampaigns: toNumber(campaignRow[0]?.active),
			confirmationsToday: toNumber(confirmationRow[0]?.confirmed),
			notificationsSentToday: toNumber(confirmationRow[0]?.notified),
		}
	}
}
