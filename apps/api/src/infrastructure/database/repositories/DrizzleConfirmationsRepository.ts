import { randomBytes } from "node:crypto"
import { eq, sql } from "drizzle-orm"
import { db } from "@infrastructure/database/drizzle/client"
import {
	campaigns,
	confirmations,
} from "@infrastructure/database/drizzle/schema/index"
import { NotFoundError } from "@/core/errors/NotFoundError"
import type { ConfirmDonationIntentionOutput } from "@/application/dtos/confirmations/ConfirmDonationIntentionOutput"
import type { CreateConfirmationInput } from "@/application/dtos/confirmations/CreateConfirmationInput"
import type { IConfirmationsRepository } from "@/application/interfaces/IConfirmationsRepository"
import { env } from "@/env"
import { MS_PER_SECOND } from "@/domain/utils/dateUtils"

export class DrizzleConfirmationsRepository
	implements IConfirmationsRepository
{
	async generateToken({
		campaignId,
		donorId,
	}: CreateConfirmationInput): Promise<string> {
		const token = randomBytes(32).toString("base64url")

		const [confirmation] = await db
			.insert(confirmations)
			.values({ token, campaignId, donorId })
			.onConflictDoUpdate({
				target: [confirmations.campaignId, confirmations.donorId],
				set: { token: sql`${confirmations.token}` },
			})
			.returning({ token: confirmations.token })

		return confirmation.token
	}

	createConfirmationLink(token: string): string {
		return `${env.WEB_ORIGIN}/confirmacoes/${token}`
	}

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
			return {
				confirmedAt: confirmation.confirmedAt.toISOString(),
				alreadyConfirmed: true,
			}
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

		return {
			confirmedAt: confirmedAt.toISOString(),
			alreadyConfirmed: false,
		}
	}
}
