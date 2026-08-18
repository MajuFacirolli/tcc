import type { ConfirmDonationIntentionOutput } from "@/application/dtos/confirmations/ConfirmDonationIntentionOutput"
import type { IConfirmationsRepository } from "@/application/interfaces/IConfirmationsRepository"

export class ConfirmDonationIntentionUseCase {
	constructor(
		private readonly confirmationsRepository: IConfirmationsRepository,
	) {}

	async execute(token: string): Promise<ConfirmDonationIntentionOutput> {
		const response = await this.confirmationsRepository.confirm(token)

		return response
	}
}
