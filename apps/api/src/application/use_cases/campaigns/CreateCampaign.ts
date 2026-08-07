import type {
	ICampaignsRepository,
	ICreateCampaignParams,
} from "@application/interfaces/ICampaignsRepository"

export class CreateCampaignUseCase {
	constructor(private readonly campaignsRepository: ICampaignsRepository) {}

	async execute(data: ICreateCampaignParams): Promise<string> {
		return this.campaignsRepository.create(data)
	}
}
