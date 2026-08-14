import type { ConfirmDonationIntentionOutput } from "@/application/dtos/confirmations/ConfirmDonationIntentionOutput"
import type { IConfirmationsRepository } from "@/application/interfaces/IConfirmationsRepository"

export class DrizzleConfirmationsRepository
	implements IConfirmationsRepository
{
	async confirm(token: string): Promise<ConfirmDonationIntentionOutput> {
		return {
			confirmedAt: new Date(),
		}
	}
}
