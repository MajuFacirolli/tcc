import type { Campaign } from "@/domain/entities/Campaign"

export type ListCampaignsOutput = {
	items: Array<Campaign>
	total: number
}
