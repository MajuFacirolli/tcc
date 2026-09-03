import { isDonorEligible } from "@domain/rules/donorEligibility"
import type { CampaignKind } from "@domain/value_objects/CampaignKind"
import type { BloodType } from "@domain/value_objects/BloodType"
import type { Sex } from "@domain/value_objects/Sex"

export type CampaignAudienceDonor = {
	sex: Sex
	bloodType: BloodType
	lastDonationDate: Date | null
}

/**
 * Who a campaign notifies, by kind — the experiment's independent variable, defined
 * once so `CreateCampaign` and the seeded trial cannot drift apart.
 *
 * `now` is a parameter because the seeded trial resolves eligibility at each
 * campaign's own date.
 */
export function isInCampaignAudience(
	donor: CampaignAudienceDonor,
	kind: CampaignKind,
	campaignBloodType: BloodType | null,
	now: Date = new Date(),
): boolean {
	if (kind === "generic") return true

	return (
		donor.bloodType === campaignBloodType &&
		isDonorEligible(donor.sex, donor.lastDonationDate, now)
	)
}

export function selectCampaignAudience<T extends CampaignAudienceDonor>(
	donors: readonly T[],
	kind: CampaignKind,
	campaignBloodType: BloodType | null,
	now: Date = new Date(),
): T[] {
	return donors.filter((donor) =>
		isInCampaignAudience(donor, kind, campaignBloodType, now),
	)
}

/**
 * How many of those notified could actually confirm. The gap between this and the
 * audience size is the waste a generic campaign incurs by construction.
 */
export function countEligibleInAudience(
	audience: readonly CampaignAudienceDonor[],
	now: Date = new Date(),
): number {
	return audience.filter((donor) =>
		isDonorEligible(donor.sex, donor.lastDonationDate, now),
	).length
}
