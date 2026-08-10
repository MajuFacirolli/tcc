import type { TFactory } from "@/core/Factory"
import { GetCampaignsQuery } from "@/data/queries/GetCampaignsQuery"
import type { IGetCampaignsQuery } from "@/domain/queries/IGetCampaignsQuery"

export const createGetCampaignsQuery: TFactory<IGetCampaignsQuery> = () => {
	return new GetCampaignsQuery()
}
