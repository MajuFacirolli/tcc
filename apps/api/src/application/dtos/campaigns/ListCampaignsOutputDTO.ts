import type { Campaign } from "@/domain/entities/Campaign"

export type ListCampaignsOutputDTO = {
	items: Array<Campaign>
	total: number
}
