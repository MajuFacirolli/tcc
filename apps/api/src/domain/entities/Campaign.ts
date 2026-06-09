import type { BloodType } from "@domain/value_objects/BloodType"
import type { CampaignStatus } from "@domain/value_objects/CampaignStatus"
import type { CampaignMetrics } from "@domain/entities/CampaignMetrics"

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

export type CampaignSummary = {
	id: string
	title: string
	bloodType: BloodType
	notifiedCount: number
	conversionRate: number
}
