import type { BloodType } from "@/@types/BloodType"
import type { CampaignStatus } from "@/@types/CampaignStatus"
import type { CampaignMetrics } from "@/entities/CampaignMetrics"

export class Campaign {
	constructor(
		public readonly id: string,
		public title: string,
		public message: string,
		public bloodType: BloodType,
		public status: CampaignStatus,
		public metrics: CampaignMetrics,
		public readonly createdAt: Date,
	) {}
}
