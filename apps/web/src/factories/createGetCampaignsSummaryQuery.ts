import type { TFactory } from "@/core/Factory"
import { GetCampaignsSummaryQuery } from "@/data/queries/GetCampaignsSummaryQuery"
import type { IGetCampaignsSummaryQuery } from "@/domain/queries/IGetCampaignsSummaryQuery"

export const createGetCampaignsSummaryQuery: TFactory<
	IGetCampaignsSummaryQuery
> = () => {
	return new GetCampaignsSummaryQuery()
}
