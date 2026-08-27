import type { IDonorsRepository } from "@application/interfaces/IDonorsRepository"
import type { CountEligibleDonorsInput } from "@/application/dtos/donors/CountEligibleDonorsInput"
import type { CountEligibleDonorsOutput } from "@/application/dtos/donors/CountEligibleDonorsOutput"

export class CountEligibleDonorsUseCase {
	constructor(private readonly donorsRepository: IDonorsRepository) {}

	async execute(
		params: CountEligibleDonorsInput,
	): Promise<CountEligibleDonorsOutput> {
		const total = await this.donorsRepository.countEligibleByBloodType(
			params.bloodType,
		)

		return { total }
	}
}
