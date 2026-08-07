import type { BloodType } from "@domain/value_objects/BloodType"
import type { Campaign, CampaignSummary } from "@domain/entities/Campaign"
import type { GetCampaignsInputDTO } from "@application/dtos/campaigns/GetCampaignsInputDTO"

export type ICreateCampaignParams = {
	title: string
	message: string
	bloodType: BloodType
}

export interface ICampaignsRepository {
	list(params?: GetCampaignsInputDTO): Promise<Array<Campaign>>
	listSummary(): Promise<Array<CampaignSummary>>
	get(id: string): Promise<Campaign>
	create(data: ICreateCampaignParams): Promise<string>
}
