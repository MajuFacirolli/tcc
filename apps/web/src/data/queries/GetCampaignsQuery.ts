import { left, right, type TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type {
	IGetCampaignsQuery,
	IGetCampaignsQueryExecuteParams,
} from "@/domain/queries/IGetCampaignsQuery"
import { client } from "../modules/client"
import type { IApiResponse } from "../modules/client/types/IApiResponse"
import { parseError } from "@/utils/parseError"
import { CampaignVM } from "@/domain/viewmodels/CampaignVM"
import { CampaignResponse } from "../models/responses/CampaignResponse"
import { mapper } from "../mappers/mapper"
import type { IPagedList } from "@/core/PagedList"
import { stringifyQuery } from "@/utils/stringifyQuery"

export class GetCampaignsQuery implements IGetCampaignsQuery {
	async execute(
		params: IGetCampaignsQueryExecuteParams,
	): Promise<TEither<TApplicationError, IPagedList<CampaignVM>>> {
		try {
			const { data } = await client<IApiResponse<IPagedList<CampaignResponse>>>(
				`/campaigns?${stringifyQuery(params, { skipNulls: true })}`,
			)

			const mappedData = mapper.mapArray(
				data.data.items,
				CampaignResponse,
				CampaignVM,
			)

			return right({ ...data.data, items: mappedData })
		} catch (error) {
			return left(parseError(error))
		}
	}
}
