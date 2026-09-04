import type { BloodType } from "@domain/value_objects/BloodType"
import type { Sex } from "@domain/value_objects/Sex"
import { isDonorEligible } from "@domain/rules/donorEligibility"

export class Donor {
	constructor(
		public readonly id: string,
		public name: string,
		public sex: Sex,
		public bloodType: BloodType,
		public lastDonationDate: Date | null,
		public email: string,
	) {}

	get isEligible(): boolean {
		return isDonorEligible(this.sex, this.lastDonationDate)
	}
}
