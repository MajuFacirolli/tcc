export class CampaignMetrics {
	constructor(
		public totalEligibleDonors: number,
		public notifiedCount: number,
		public intentionConfirmationsCount: number,
		public averageResponseTime: number,
	) {}

	static calculateConversionRate(
		notifiedCount: number,
		intentionConfirmationsCount: number,
	): number {
		if (notifiedCount === 0) return 0
		return intentionConfirmationsCount / notifiedCount
	}

	get conversionRate(): number {
		return CampaignMetrics.calculateConversionRate(
			this.notifiedCount,
			this.intentionConfirmationsCount,
		)
	}
}
