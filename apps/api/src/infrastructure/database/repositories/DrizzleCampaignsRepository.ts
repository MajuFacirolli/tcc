import { and, desc, eq, sql } from "drizzle-orm"
import { db } from "@infrastructure/database/drizzle/client"
import { campaigns } from "@infrastructure/database/drizzle/schema/index"
import { Campaign, type CampaignSummary } from "@domain/entities/Campaign"
import { CampaignMetrics } from "@domain/entities/CampaignMetrics"
import { NotFoundError } from "@/core/errors/NotFoundError"
import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"
import type { ListCampaignsInput } from "@/application/dtos/campaigns/ListCampaignsInput"
import type { ListCampaignsOutput } from "@/application/dtos/campaigns/ListCampaignsOutput"
import { DEFAULT_PAGE_SIZE } from "@/core/PagedList"
import type { CreateCampaignsInput } from "@/application/dtos/campaigns/CreateCampaignInput"

export class DrizzleCampaignsRepository implements ICampaignsRepository {
	private rowToMetrics(row: typeof campaigns.$inferSelect): CampaignMetrics {
		return new CampaignMetrics(
			row.totalEligibleDonors,
			row.notifiedCount,
			row.intentionConfirmationsCount,
			row.averageResponseTime,
		)
	}

	async list(params: ListCampaignsInput): Promise<ListCampaignsOutput> {
		const limit = params.limit ?? DEFAULT_PAGE_SIZE
		const offset = (params.page - 1) * limit

		const filters = and(
			params.status ? eq(campaigns.status, params.status) : undefined,
			params.bloodType ? eq(campaigns.bloodType, params.bloodType) : undefined,
		)

		const [countRow] = await db
			.select({ total: sql<number>`count(*)` })
			.from(campaigns)
			.where(filters)

		const rows = await db
			.select()
			.from(campaigns)
			.where(filters)
			.orderBy(desc(campaigns.createdAt), desc(campaigns.id))
			.limit(limit)
			.offset(offset)

		const items = rows.map(
			(row) =>
				new Campaign(
					row.id,
					row.title,
					row.message,
					row.bloodType,
					row.status,
					this.rowToMetrics(row),
					row.createdAt,
				),
		)

		return {
			items,
			total: Number(countRow?.total ?? 0),
		}
	}

	async listSummary(): Promise<Array<CampaignSummary>> {
		const rows = await db
			.select({
				id: campaigns.id,
				title: campaigns.title,
				bloodType: campaigns.bloodType,
				notifiedCount: campaigns.notifiedCount,
				intentionConfirmationsCount: campaigns.intentionConfirmationsCount,
			})
			.from(campaigns)
			.orderBy(desc(campaigns.createdAt))
			.limit(5)

		return rows.map((row) => ({
			id: row.id,
			title: row.title,
			bloodType: row.bloodType,
			notifiedCount: row.notifiedCount,
			conversionRate: CampaignMetrics.calculateConversionRate(
				row.notifiedCount,
				row.intentionConfirmationsCount,
			),
		}))
	}

	async get(id: string): Promise<Campaign> {
		const [row] = await db
			.select()
			.from(campaigns)
			.where(eq(campaigns.id, id))
			.limit(1)

		if (!row)
			throw new NotFoundError(
				new Error(`Campaign with id "${id}" was not found`),
			)

		return new Campaign(
			row.id,
			row.title,
			row.message,
			row.bloodType,
			row.status,
			this.rowToMetrics(row),
			row.createdAt,
		)
	}

	async create(params: CreateCampaignsInput): Promise<string> {
		const [row] = await db
			.insert(campaigns)
			.values(params)
			.returning({ id: campaigns.id })
		return row.id
	}

	async incrementNotifiedCount(campaignId: string): Promise<void> {
		const [row] = await db
			.update(campaigns)
			.set({
				notifiedCount: sql<number>`${campaigns.notifiedCount} + 1`,
			})
			.where(eq(campaigns.id, campaignId))
			.returning({ id: campaigns.id })

		if (!row.id)
			throw new NotFoundError(
				new Error(`Campaign with id "${campaignId}" was not found`),
			)
	}
}
