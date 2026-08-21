import { left, right, type TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type { IGetBloodBankSummaryQuery } from "@/domain/queries/IGetBloodBankSummaryQuery"
import { BloodBankSummaryVM } from "@/domain/viewmodels/BloodBankSummaryVM"
import { parseError } from "@/utils/parseError"
import { client } from "../modules/client"
import type { IApiResponse } from "../modules/client/types/IApiResponse"
import { BloodBankSummaryResponse } from "../models/responses/BloodBankSummaryResponse"
import { mapper } from "../mappers/mapper"

export class GetBloodBankSummaryQuery implements IGetBloodBankSummaryQuery {
	async execute(): Promise<
		TEither<TApplicationError, Array<BloodBankSummaryVM>>
	> {
		try {
			const { data } =
				await client<IApiResponse<Array<BloodBankSummaryResponse>>>(
					"/bloodBank/summary",
				)

			const mappedData = mapper.mapArray(
				data.data,
				BloodBankSummaryResponse,
				BloodBankSummaryVM,
			)

			return right(mappedData)
		} catch (error) {
			return left(parseError(error))
		}
	}
}
