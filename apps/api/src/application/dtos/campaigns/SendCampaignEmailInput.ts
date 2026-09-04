/** Donor facts ride along so the worker needs no per-notification query. */
export type SendCampaignEmailInput = {
	campaignId: string
	campaignTitle: string
	campaignMessage: string
	donorId: string
	donorEmail: string
	donorName: string
}
