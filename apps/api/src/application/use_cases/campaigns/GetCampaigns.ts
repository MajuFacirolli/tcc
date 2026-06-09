import type { Campaign } from "@domain/entities/Campaign"
import type {
	ICampaignsRepository,
	IGetCampaignsParams,
} from "@application/interfaces/ICampaignsRepository"

export class GetCampaignsUseCase {
	constructor(private readonly campaignsRepository: ICampaignsRepository) {}

	async execute(filters?: IGetCampaignsParams): Promise<Campaign[]> {
		return this.campaignsRepository.list(filters)
	}
}
