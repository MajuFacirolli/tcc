import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"
import {
	type GetCampaignOutput,
	toGetCampaignOutput,
} from "@/application/dtos/campaigns/GetCampaignOutput"

export class GetCampaignUseCase {
	constructor(private readonly campaignsRepository: ICampaignsRepository) {}

	async execute(id: string): Promise<GetCampaignOutput> {
		const campaign = await this.campaignsRepository.get(id)
		return toGetCampaignOutput(campaign)
	}
}
