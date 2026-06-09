export class CampaignMetrics {
	constructor(
		public totalEligibleDonors: number,
		public notifiedCount: number,
		public intentionConfirmationsCount: number,
		public averageResponseTime: number,
	) {}

	get conversionRate(): number {
		if (this.notifiedCount === 0) return 0
		return this.intentionConfirmationsCount / this.notifiedCount
	}
}
