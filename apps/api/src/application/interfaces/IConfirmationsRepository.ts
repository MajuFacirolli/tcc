import type { ConfirmDonationIntentionOutput } from "../dtos/confirmations/ConfirmDonationIntentionOutput"

export interface IConfirmationsRepository {
	confirm(token: string): Promise<ConfirmDonationIntentionOutput>
}
