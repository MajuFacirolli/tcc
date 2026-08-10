import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"
import type { ListCampaignsInputDTO } from "@/application/dtos/campaigns/ListCampaignsInputDTO"
import {
	type GetCampaignOutputDTO,
	toGetCampaignOutputDTO,
} from "@application/dtos/campaigns/GetCampaignOutputDTO"
import {
	DEFAULT_PAGE_SIZE,
	type PagedList,
	toPagedList,
} from "@/core/PagedList"

export class GetCampaignsUseCase {
	constructor(private readonly campaignsRepository: ICampaignsRepository) {}

	async execute(
		params: ListCampaignsInputDTO,
	): Promise<PagedList<GetCampaignOutputDTO>> {
		const { items, total } = await this.campaignsRepository.list(params)

		return toPagedList(
			items.map(toGetCampaignOutputDTO),
			total,
			params.page,
			DEFAULT_PAGE_SIZE,
		)
	}
}
