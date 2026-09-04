import {
	toBloodBankSummaryOutput,
	type GetBloodBankSummaryOutput,
} from "@/application/dtos/bloodBank/GetBloodBankSummaryOutput"
import type { IBloodBankRepository } from "@/application/interfaces/IBloodBankRepository"

export class GetBloodBankSummaryUseCase {
	constructor(private readonly bloodBankRepository: IBloodBankRepository) {}

	async execute(): Promise<Array<GetBloodBankSummaryOutput>> {
		const response = await this.bloodBankRepository.list()

		return response.map(toBloodBankSummaryOutput)
	}
}
