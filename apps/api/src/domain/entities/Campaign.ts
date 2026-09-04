import type { BloodType } from "@domain/value_objects/BloodType"
import type { CampaignKind } from "@domain/value_objects/CampaignKind"
import type { CampaignStatus } from "@domain/value_objects/CampaignStatus"
import type { CampaignMetrics } from "@domain/entities/CampaignMetrics"

export class Campaign {
	constructor(
		public readonly id: string,
		public title: string,
		public message: string,
		public bloodType: BloodType | null,
		public kind: CampaignKind,
		public status: CampaignStatus,
		public metrics: CampaignMetrics,
		public readonly createdAt: Date,
	) {}
}

export type CampaignSummary = {
	id: string
	title: string
	bloodType: BloodType | null
	kind: CampaignKind
	notifiedCount: number
	conversionRate: number
}
