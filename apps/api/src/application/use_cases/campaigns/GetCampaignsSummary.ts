import type { CampaignSummary } from "@domain/entities/Campaign"
import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"

export class GetCampaignsSummaryUseCase {
	constructor(private readonly campaignsRepository: ICampaignsRepository) {}

	async execute(): Promise<CampaignSummary[]> {
		return this.campaignsRepository.listSummary()
	}
}
