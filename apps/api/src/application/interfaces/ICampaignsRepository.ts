import type { Campaign, CampaignSummary } from "@domain/entities/Campaign"
import type { ListCampaignsInputDTO } from "@/application/dtos/campaigns/ListCampaignsInputDTO"
import type { ListCampaignsOutputDTO } from "../dtos/campaigns/ListCampaignsOutputDTO"
import type { CreateCampaignsInputDTO } from "../dtos/campaigns/CreateCampaignInputDTO"

export interface ICampaignsRepository {
	list(params: ListCampaignsInputDTO): Promise<ListCampaignsOutputDTO>
	listSummary(): Promise<Array<CampaignSummary>>
	get(id: string): Promise<Campaign>
	create(data: CreateCampaignsInputDTO): Promise<string>
}
