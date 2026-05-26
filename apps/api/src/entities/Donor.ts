import type { BloodType } from "@/@types/BloodType"
import type { Sex } from "@/@types/Sex"
import { MS_PER_DAY } from "@/utils/dateUtils"

const ELIGIBILITY_DAYS: Record<Sex, number> = {
	male: 60,
	female: 90,
}

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
		if (!this.lastDonationDate) return true
		const days = Math.floor(
			(Date.now() - this.lastDonationDate.getTime()) / MS_PER_DAY,
		)
		return days >= ELIGIBILITY_DAYS[this.sex]
	}
}
