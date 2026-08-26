import type { IDonorsRepository } from "@application/interfaces/IDonorsRepository"
import type { ListDonorsInput } from "@/application/dtos/donors/ListDonorsInput"
import {
	type GetDonorOutput,
	toGetDonorOutput,
} from "@/application/dtos/donors/GetDonorOutput"
import {
	DEFAULT_PAGE_SIZE,
	type PagedList,
	toPagedList,
} from "@/core/PagedList"

export class GetDonorsUseCase {
	constructor(private readonly donorsRepository: IDonorsRepository) {}

	async execute(params: ListDonorsInput): Promise<PagedList<GetDonorOutput>> {
		const { items, total } = await this.donorsRepository.list(params)

		return toPagedList(
			items.map(toGetDonorOutput),
			total,
			params.page,
			DEFAULT_PAGE_SIZE,
		)
	}
}
