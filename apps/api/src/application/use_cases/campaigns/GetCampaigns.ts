import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"
import type { GetCampaignsInputDTO } from "@application/dtos/campaigns/GetCampaignsInputDTO"
import {
	type GetCampaignOutputDTO,
	toGetCampaignOutputDTO,
} from "@application/dtos/campaigns/GetCampaignOutputDTO"

export class GetCampaignsUseCase {
	constructor(private readonly campaignsRepository: ICampaignsRepository) {}

	async execute(
		filters?: GetCampaignsInputDTO,
	): Promise<GetCampaignOutputDTO[]> {
		const campaigns = await this.campaignsRepository.list(filters)
		return campaigns.map(toGetCampaignOutputDTO)
	}
}
