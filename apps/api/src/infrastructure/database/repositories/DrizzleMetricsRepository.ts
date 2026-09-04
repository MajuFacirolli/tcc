import { and, asc, desc, eq, sql } from "drizzle-orm"
import { db } from "@infrastructure/database/drizzle/client"
import {
	bloodBank,
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
	MetricsCampaignRow,
	MetricsReachRow,
	MetricsRetentionRow,
	MetricsSpeedRow,
	MetricsTotalsRow,
} from "@application/interfaces/IMetricsRepository"
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
 * The single scoping rule: the notification was issued inside the window. The answer
 * it drew counts with it whenever it arrived, so every panel divides the same set of
 * messages and the totals reconcile without a second convention.
 */
function notifiedIn({ from, to }: IMetricsRepositoryWindow) {
	return sql`${confirmations.createdAt} >= ${utcLiteral(from)} and ${confirmations.createdAt} < ${utcLiteral(to)}`
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

	async getTotals(window: IMetricsRepositoryWindow): Promise<MetricsTotalsRow> {
		const [row] = await db
			.select({
				notifications: sql<number>`count(*)`,
				intentions: sql<number>`count(${confirmations.confirmedAt})`,
				averageResponseTime: sql<number | null>`avg(${responseTimeSeconds})`,
			})
			.from(confirmations)
			.where(notifiedIn(window))

		return {
			notifications: toNumber(row?.notifications),
			intentions: toNumber(row?.intentions),
			averageResponseTime: toNullableNumber(row?.averageResponseTime),
		}
	}

	/**
	 * People, not messages. A donor reached by seven campaigns is one donor here, which
	 * is what turns "how much of the base actually engages" into an answerable question.
	 */
	async getReach(window: IMetricsRepositoryWindow): Promise<MetricsReachRow> {
		const answeredPerDonor = db
			.select({ donorId: confirmations.donorId })
			.from(confirmations)
			.where(
				and(notifiedIn(window), sql`${confirmations.confirmedAt} is not null`),
			)
			.groupBy(confirmations.donorId)
			.having(sql`count(*) > 1`)
			.as("repeat_responders")

		const [reach, repeat] = await Promise.all([
			db
				.select({
					donorsReached: sql<number>`count(distinct ${confirmations.donorId})`,
					respondingDonors: sql<number>`count(distinct ${confirmations.donorId}) filter (where ${confirmations.confirmedAt} is not null)`,
				})
				.from(confirmations)
				.where(notifiedIn(window)),
			db.select({ total: sql<number>`count(*)` }).from(answeredPerDonor),
		])

		return {
			donorsReached: toNumber(reach[0]?.donorsReached),
			respondingDonors: toNumber(reach[0]?.respondingDonors),
			repeatResponders: toNumber(repeat[0]?.total),
		}
	}

	/**
	 * Pairs each notification with the same donor's next one, then asks what the first
	 * outcome did to the second. Two rates fall out of the same pass: retention (was
	 * answered, answered again) and reactivation (was ignored, answered anyway) — and
	 * the gap between them is the whole value of having answered once.
	 */
	async getRetention(
		window: IMetricsRepositoryWindow,
	): Promise<MetricsRetentionRow> {
		const result = await db.execute(sql`
			with paired as (
				select
					${confirmations.confirmedAt} is not null as answered,
					lead(${confirmations.confirmedAt} is not null) over (
						partition by ${confirmations.donorId}
						order by ${confirmations.createdAt}
					) as answered_next
				from ${confirmations}
				where ${notifiedIn(window)}
			)
			select
				count(*) filter (where answered and answered_next is not null) as answered_then_notified,
				count(*) filter (where answered and answered_next) as answered_again,
				count(*) filter (where not answered and answered_next is not null) as ignored_then_notified,
				count(*) filter (where not answered and answered_next) as reactivated
			from paired
		`)

		const row = (result.rows[0] ?? {}) as Record<string, unknown>

		return {
			answeredThenNotified: toNumber(row.answered_then_notified),
			answeredAgain: toNumber(row.answered_again),
			ignoredThenNotified: toNumber(row.ignored_then_notified),
			reactivated: toNumber(row.reactivated),
		}
	}

	async getResponseSpeed(
		window: IMetricsRepositoryWindow,
		hourCutoffs: readonly number[],
	): Promise<MetricsSpeedRow[]> {
		// One pass, one aggregate per cut-off: `filter` scopes each independently, so
		// the cumulative curve costs a single scan.
		const columns = Object.fromEntries(
			hourCutoffs.map((hours) => [
				`h${hours}`,
				sql<number>`count(*) filter (where ${responseTimeSeconds} <= ${hours * 3600})`,
			]),
		)

		const [row] = await db
			.select(columns)
			.from(confirmations)
			.where(
				and(notifiedIn(window), sql`${confirmations.confirmedAt} is not null`),
			)

		return hourCutoffs.map((hours) => ({
			hours,
			intentions: toNumber((row as Record<string, unknown>)?.[`h${hours}`]),
		}))
	}

	/**
	 * The donor's own blood type, not the campaign's — a generic campaign names none —
	 * joined to the bank's level for that type, because a response rate only becomes a
	 * decision next to how short the shelf is.
	 */
	async getByBloodType(
		window: IMetricsRepositoryWindow,
	): Promise<MetricsBloodTypeRow[]> {
		const [responses, stock] = await Promise.all([
			db
				.select({
					bloodType: donors.bloodType,
					notifications: sql<number>`count(*)`,
					intentions: sql<number>`count(${confirmations.confirmedAt})`,
				})
				.from(confirmations)
				.innerJoin(donors, eq(donors.id, confirmations.donorId))
				.where(notifiedIn(window))
				.groupBy(donors.bloodType),
			db
				.select({
					bloodType: bloodBank.id,
					bagsCount: bloodBank.bagsCount,
					minThreshold: bloodBank.minThreshold,
				})
				.from(bloodBank),
		])

		const responsesByType = new Map(
			responses.map((row) => [row.bloodType, row]),
		)

		return stock.map((entry) => {
			const response = responsesByType.get(entry.bloodType)

			return {
				bloodType: entry.bloodType,
				notifications: toNumber(response?.notifications),
				intentions: toNumber(response?.intentions),
				bagsCount: toNumber(entry.bagsCount),
				minThreshold: toNumber(entry.minThreshold),
			}
		})
	}

	/**
	 * Bucketed by the day the notification went out, and the intentions counted are the
	 * ones those notifications drew. Reading it as a cohort rather than as arrivals is
	 * what lets the series sum to the headline exactly.
	 */
	async getBuckets(
		window: IMetricsRepositoryWindow,
	): Promise<MetricsBucketRow[]> {
		const { from, to } = window

		// The generate_series spine is what guarantees a continuous x-axis: a plain
		// GROUP BY would omit silent days and the chart would skip them.
		const result = await db.execute(sql`
			with spine as (
				select generate_series(
					${utcLiteral(from)},
					${utcLiteral(to)} - interval '1 day',
					interval '1 day'
				) as bucket_start
			),
			sent as (
				select date_trunc('day', ${confirmations.createdAt}) as bucket_start,
					count(*) as notifications,
					count(${confirmations.confirmedAt}) as intentions
				from ${confirmations}
				where ${notifiedIn(window)}
				group by 1
			)
			select
				spine.bucket_start,
				coalesce(sent.notifications, 0) as notifications,
				coalesce(sent.intentions, 0) as intentions
			from spine
			left join sent on sent.bucket_start = spine.bucket_start
			order by spine.bucket_start
		`)

		return result.rows.map((row) => {
			const bucket = row as Record<string, unknown>
			return {
				bucketStart: parseUtcTimestamp(bucket.bucket_start),
				notifications: toNumber(bucket.notifications),
				intentions: toNumber(bucket.intentions),
			}
		})
	}

	/** Newest first: the manager is judging what was just sent. */
	async getCampaigns(
		window: IMetricsRepositoryWindow,
	): Promise<MetricsCampaignRow[]> {
		const rows = await db
			.select({
				id: campaigns.id,
				title: campaigns.title,
				createdAt: campaigns.createdAt,
				notifications: sql<number>`count(${confirmations.id})`,
				intentions: sql<number>`count(${confirmations.confirmedAt})`,
				averageResponseTime: sql<number | null>`avg(${responseTimeSeconds})`,
			})
			.from(campaigns)
			.leftJoin(confirmations, eq(confirmations.campaignId, campaigns.id))
			.where(
				sql`${campaigns.createdAt} >= ${utcLiteral(window.from)} and ${campaigns.createdAt} < ${utcLiteral(window.to)}`,
			)
			.groupBy(campaigns.id, campaigns.title, campaigns.createdAt)
			.orderBy(desc(campaigns.createdAt), asc(campaigns.id))

		return rows.map((row) => ({
			id: row.id,
			title: row.title,
			createdAt: row.createdAt,
			notifications: toNumber(row.notifications),
			intentions: toNumber(row.intentions),
			averageResponseTime: toNullableNumber(row.averageResponseTime),
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
