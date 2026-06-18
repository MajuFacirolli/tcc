import type { Campaign } from "@domain/entities/Campaign"
import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"

export class GetCampaignUseCase {
	constructor(private readonly campaignsRepository: ICampaignsRepository) {}

	async execute(id: string): Promise<Campaign> {
		return this.campaignsRepository.get(id)
	}
}
