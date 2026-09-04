import type { IDonorsRepository } from "@application/interfaces/IDonorsRepository"
import type { ListDonorsInput } from "@/application/dtos/donors/ListDonorsInput"
import {
	type GetDonorOutput,
	toGetDonorOutput,
} from "@/application/dtos/donors/GetDonorOutput"
import { type PagedList, toPagedList } from "@/core/PagedList"

const DONORS_PAGE_SIZE = 12

export class GetDonorsUseCase {
	constructor(private readonly donorsRepository: IDonorsRepository) {}

	async execute(params: ListDonorsInput): Promise<PagedList<GetDonorOutput>> {
		const { items, total } = await this.donorsRepository.list({
			...params,
			limit: DONORS_PAGE_SIZE,
		})

		return toPagedList(
			items.map(toGetDonorOutput),
			total,
			params.page,
			DONORS_PAGE_SIZE,
		)
	}
}
