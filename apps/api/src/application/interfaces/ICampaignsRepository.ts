import type { CampaignSummary } from "@domain/entities/Campaign"
import type { ListCampaignsInput } from "@/application/dtos/campaigns/ListCampaignsInput"
import type { ListCampaignsOutput } from "../dtos/campaigns/ListCampaignsOutput"
import type { CreateCampaignsInput } from "../dtos/campaigns/CreateCampaignInput"

export interface ICampaignsRepository {
	list(params: ListCampaignsInput): Promise<ListCampaignsOutput>
	listSummary(): Promise<Array<CampaignSummary>>
	create(data: CreateCampaignsInput): Promise<string>
	incrementNotifiedCount(campaignId: string): Promise<void>
	closeCampaign(campaignId: string): Promise<void>
}
