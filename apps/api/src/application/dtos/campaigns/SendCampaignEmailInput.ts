import type { BloodBankStatus } from "@domain/value_objects/BloodBankStatus"
import type { BloodType } from "@domain/value_objects/BloodType"

/** Donor and stock facts ride along so the worker needs no per-notification query. */
export type SendCampaignEmailInput = {
	campaignId: string
	campaignTitle: string
	campaignMessage: string
	campaignBloodType: BloodType | null
	donorId: string
	donorEmail: string
	donorName: string
	donorBloodType: BloodType
	donorIsEligible: boolean
	stockStatus: BloodBankStatus
}
