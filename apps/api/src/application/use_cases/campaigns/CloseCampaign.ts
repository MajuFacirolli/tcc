import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"

export class CloseCampaignUseCase {
	constructor(private readonly campaignsRepository: ICampaignsRepository) {}

	async execute(campaignId: string): Promise<void> {
		await this.campaignsRepository.closeCampaign(campaignId)
	}
}
