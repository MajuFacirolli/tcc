import { AutoMap } from "@automapper/classes"

export class DailyMetricsVM {
	@AutoMap()
	registeredDonors: number

	@AutoMap()
	eligibleDonors: number

	@AutoMap()
	activeCampaigns: number

	@AutoMap()
	confirmationsToday: number

	@AutoMap()
	notificationsSentToday: number

	constructor(
		registeredDonors: number,
		eligibleDonors: number,
		activeCampaigns: number,
		confirmationsToday: number,
		notificationsSentToday: number,
	) {
		this.registeredDonors = registeredDonors
		this.eligibleDonors = eligibleDonors
		this.activeCampaigns = activeCampaigns
		this.confirmationsToday = confirmationsToday
		this.notificationsSentToday = notificationsSentToday
	}
}
