import { eq, sql } from "drizzle-orm"
import { db } from "@infrastructure/database/drizzle/client"
import {
	campaigns,
	confirmations,
} from "@infrastructure/database/drizzle/schema/index"
import { NotFoundError } from "@/core/errors/NotFoundError"
import { ConflictError } from "@/core/errors/ConflictError"
import type { ConfirmDonationIntentionOutput } from "@/application/dtos/confirmations/ConfirmDonationIntentionOutput"
import type { IConfirmationsRepository } from "@/application/interfaces/IConfirmationsRepository"
import { MS_PER_SECOND } from "@/domain/utils/dateUtils"

export class DrizzleConfirmationsRepository
	implements IConfirmationsRepository
{
	async confirm(token: string): Promise<ConfirmDonationIntentionOutput> {
		const [confirmation] = await db
			.select({
				campaignId: confirmations.campaignId,
				confirmedAt: confirmations.confirmedAt,
				createdAt: confirmations.createdAt,
			})
			.from(confirmations)
			.where(eq(confirmations.token, token))

		if (!confirmation)
			throw new NotFoundError(
				new Error(`Confirmation with token "${token}" was not found`),
			)

		if (confirmation.confirmedAt) {
			throw new ConflictError(
				new Error("Donation intention has already been confirmed"),
			)
		}

		const confirmedAt = new Date()
		const responseTime = Math.round(
			(confirmedAt.getTime() - confirmation.createdAt.getTime()) /
				MS_PER_SECOND,
		)

		await db.transaction(async (tx) => {
			await tx
				.update(confirmations)
				.set({ confirmedAt })
				.where(eq(confirmations.token, token))

			await tx
				.update(campaigns)
				.set({
					intentionConfirmationsCount: sql`${campaigns.intentionConfirmationsCount} + 1`,
					averageResponseTime: sql`round(
						((${campaigns.averageResponseTime}::numeric * ${campaigns.intentionConfirmationsCount}) + ${responseTime})
						/ (${campaigns.intentionConfirmationsCount} + 1)
					)`,
				})
				.where(eq(campaigns.id, confirmation.campaignId))
		})

		return { confirmedAt }
	}
}
