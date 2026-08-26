import type { BloodType } from "@/domain/value_objects/BloodType"

export type ListDonorsInput = {
	page: number
	bloodType?: BloodType
	/** `true`/`false` filter by eligibility; `null` returns every donor. */
	isEligible: boolean | null
	limit?: number
}
