import type { BloodBankStatus } from "@domain/value_objects/BloodBankStatus"
import type { BloodType } from "@domain/value_objects/BloodType"

/**
 * The donor and stock facts ride along with the job rather than being looked up
 * again in the worker: `CreateCampaignUseCase` already has every donor row and the
 * blood bank in hand, so carrying them costs one campaign-wide read instead of one
 * query per notification.
 */
export type SendCampaignEmailInput = {
	campaignId: string
	campaignTitle: string
	campaignMessage: string
	campaignBloodType: BloodType
	donorId: string
	donorEmail: string
	donorName: string
	donorBloodType: BloodType
	donorIsEligible: boolean
	stockStatus: BloodBankStatus
}
