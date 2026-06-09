import { and, desc, eq } from "drizzle-orm"
import { db } from "@infrastructure/database/drizzle/client"
import { campaigns } from "@infrastructure/database/drizzle/schema/index"
import { Campaign, type CampaignSummary } from "@domain/entities/Campaign"
import { CampaignMetrics } from "@domain/entities/CampaignMetrics"
import { CampaignNotFoundError } from "@domain/exceptions/CampaignNotFoundError"
import type {
	ICampaignsRepository,
	IGetCampaignsParams,
} from "@application/interfaces/ICampaignsRepository"

export class DrizzleCampaignsRepository implements ICampaignsRepository {
	private rowToMetrics(row: {
		totalEligibleDonors: number
		notifiedCount: number
		intentionConfirmationsCount: number
		averageResponseTime: number
	}): CampaignMetrics {
		return new CampaignMetrics(
			row.totalEligibleDonors,
			row.notifiedCount,
			row.intentionConfirmationsCount,
			row.averageResponseTime,
		)
	}

	async list(params?: IGetCampaignsParams): Promise<Array<Campaign>> {
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

		return rows.map((row) => {
			const conversionRate =
				row.notifiedCount === 0
					? 0
					: row.intentionConfirmationsCount / row.notifiedCount

			return {
				id: row.id,
				title: row.title,
				bloodType: row.bloodType,
				notifiedCount: row.notifiedCount,
				conversionRate,
			}
		})
	}

	async get(id: string): Promise<Campaign> {
		const [row] = await db
			.select()
			.from(campaigns)
			.where(eq(campaigns.id, id))
			.limit(1)

		if (!row) throw new CampaignNotFoundError(id)

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

	async create(): Promise<string> {
		return ""
	}
}
