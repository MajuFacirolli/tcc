import type { BloodType } from "@domain/value_objects/BloodType"
import type { Campaign, CampaignSummary } from "@domain/entities/Campaign"
import type { ListCampaignsInputDTO } from "@/application/dtos/campaigns/ListCampaignsInputDTO"
import type { ListCampaignsOutputDTO } from "../dtos/campaigns/ListCampaignsOutputDTO"

export type ICreateCampaignParams = {
	title: string
	message: string
	bloodType: BloodType
}

export interface ICampaignsRepository {
	list(params: ListCampaignsInputDTO): Promise<ListCampaignsOutputDTO>
	listSummary(): Promise<Array<CampaignSummary>>
	get(id: string): Promise<Campaign>
	create(data: ICreateCampaignParams): Promise<string>
}
