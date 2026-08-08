import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"
import {
	type GetCampaignOutputDTO,
	toGetCampaignOutputDTO,
} from "@application/dtos/campaigns/GetCampaignOutputDTO"

export class GetCampaignUseCase {
	constructor(private readonly campaignsRepository: ICampaignsRepository) {}

	async execute(id: string): Promise<GetCampaignOutputDTO> {
		const campaign = await this.campaignsRepository.get(id)
		return toGetCampaignOutputDTO(campaign)
	}
}
