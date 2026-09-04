import type { BloodType } from "@domain/value_objects/BloodType"
import type { Sex } from "@domain/value_objects/Sex"
import type { Donor } from "@domain/entities/Donor"

export type GetDonorOutput = {
	id: string
	name: string
	email: string
	sex: Sex
	bloodType: BloodType
	lastDonationDate: string | null
	isEligible: boolean
}

export function toGetDonorOutput(donor: Donor): GetDonorOutput {
	return {
		id: donor.id,
		name: donor.name,
		email: donor.email,
		sex: donor.sex,
		bloodType: donor.bloodType,
		lastDonationDate: donor.lastDonationDate?.toISOString() ?? null,
		isEligible: donor.isEligible,
	}
}
