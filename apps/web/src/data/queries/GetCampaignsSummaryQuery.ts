import { left, right, type TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type { IGetCampaignsSummaryQuery } from "@/domain/queries/IGetCampaignsSummaryQuery"
import { CampaignSummaryVM } from "@/domain/viewmodels/CampaignSummaryVM"
import { parseError } from "@/utils/parseError"
import { client } from "../modules/client"
import type { IApiResponse } from "../modules/client/types/IApiResponse"
import { CampaignSummaryResponse } from "../models/responses/CampaignSummaryResponse"
import { mapper } from "../mappers/mapper"

export class GetCampaignsSummaryQuery implements IGetCampaignsSummaryQuery {
	async execute(): Promise<TEither<TApplicationError, CampaignSummaryVM[]>> {
		try {
			const { data } =
				await client<IApiResponse<CampaignSummaryResponse[]>>(
					"/campaigns/summary",
				)

			const mappedData = mapper.mapArray(
				data.data,
				CampaignSummaryResponse,
				CampaignSummaryVM,
			)

			return right(mappedData)
		} catch (error) {
			return left(parseError(error))
		}
	}
}
