export class CampaignNotFoundError extends Error {
	readonly code = "CAMPAIGN_NOT_FOUND"
	constructor(id: string) {
		super(`Campaign with id "${id}" was not found`)
		this.name = "CampaignNotFoundError"
	}
}
