import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"
import type { ListCampaignsInput } from "@/application/dtos/campaigns/ListCampaignsInput"
import {
	type GetCampaignOutput,
	toGetCampaignOutput,
} from "@/application/dtos/campaigns/GetCampaignOutput"
import {
	DEFAULT_PAGE_SIZE,
	type PagedList,
	toPagedList,
} from "@/core/PagedList"

export class GetCampaignsUseCase {
	constructor(private readonly campaignsRepository: ICampaignsRepository) {}

	async execute(
		params: ListCampaignsInput,
	): Promise<PagedList<GetCampaignOutput>> {
		const { items, total } = await this.campaignsRepository.list(params)

		return toPagedList(
			items.map(toGetCampaignOutput),
			total,
			params.page,
			DEFAULT_PAGE_SIZE,
		)
	}
}
