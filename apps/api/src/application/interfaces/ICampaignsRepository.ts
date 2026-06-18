import type { BloodType } from "@domain/value_objects/BloodType"
import type { CampaignStatus } from "@domain/value_objects/CampaignStatus"
import type { Campaign, CampaignSummary } from "@domain/entities/Campaign"

export type IGetCampaignsParams = {
	status?: CampaignStatus
	bloodType?: BloodType
}

export type ICreateCampaignParams = {
	title: string
	message: string
	bloodType: BloodType
}

export interface ICampaignsRepository {
	list(params?: IGetCampaignsParams): Promise<Array<Campaign>>
	listSummary(): Promise<Array<CampaignSummary>>
	get(id: string): Promise<Campaign>
	create(data: ICreateCampaignParams): Promise<string>
}
