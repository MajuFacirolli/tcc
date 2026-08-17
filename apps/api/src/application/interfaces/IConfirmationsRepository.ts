import type { ConfirmDonationIntentionOutput } from "../dtos/confirmations/ConfirmDonationIntentionOutput"
import type { CreateConfirmationInput } from "../dtos/confirmations/CreateConfirmationInput"

export interface IConfirmationsRepository {
	generateToken(input: CreateConfirmationInput): Promise<string>
	createConfirmationLink(token: string): string
	confirm(token: string): Promise<ConfirmDonationIntentionOutput>
}
