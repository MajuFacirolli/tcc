import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"
import type { CreateCampaignsInputDTO } from "@/application/dtos/campaigns/CreateCampaignInputDTO"

export class CreateCampaignUseCase {
	constructor(private readonly campaignsRepository: ICampaignsRepository) {}

	async execute(data: CreateCampaignsInputDTO): Promise<string> {
		return this.campaignsRepository.create(data)
	}
}
