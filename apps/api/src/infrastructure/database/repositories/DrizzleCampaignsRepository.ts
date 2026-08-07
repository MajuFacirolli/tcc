import { and, desc, eq } from "drizzle-orm"
import { db } from "@infrastructure/database/drizzle/client"
import { campaigns } from "@infrastructure/database/drizzle/schema/index"
import { Campaign, type CampaignSummary } from "@domain/entities/Campaign"
import { CampaignMetrics } from "@domain/entities/CampaignMetrics"
import { NotFoundError } from "@/core/errors/NotFoundError"
import type {
	ICampaignsRepository,
	ICreateCampaignParams,
} from "@application/interfaces/ICampaignsRepository"
import type { GetCampaignsInputDTO } from "@application/dtos/campaigns/GetCampaignsInputDTO"

export class DrizzleCampaignsRepository implements ICampaignsRepository {
	private rowToMetrics(row: typeof campaigns.$inferSelect): CampaignMetrics {
		return new CampaignMetrics(
			row.totalEligibleDonors,
			row.notifiedCount,
			row.intentionConfirmationsCount,
			row.averageResponseTime,
		)
	}

	async list(params?: GetCampaignsInputDTO): Promise<Array<Campaign>> {
		const rows = await db
			.select()
			.from(campaigns)
			.where(
				and(
					params?.status ? eq(campaigns.status, params.status) : undefined,
					params?.bloodType
						? eq(campaigns.bloodType, params.bloodType)
						: undefined,
				),
			)

		return rows.map(
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

	async create(params: ICreateCampaignParams): Promise<string> {
		const [row] = await db
			.insert(campaigns)
			.values(params)
			.returning({ id: campaigns.id })
		return row.id
	}
}
