import type { BloodBankStatus } from "@/@types/BloodBankStatus"
import type { BloodType } from "@/@types/BloodType"

export class BloodBank {
	constructor(
		public readonly id: BloodType,
		public bagsCount: number,
		public minThreshold: number,
		public readonly updatedAt: Date,
	) {}

	get status(): BloodBankStatus {
		if (this.bagsCount < this.minThreshold) return "critical"
		if (this.bagsCount < this.minThreshold * 1.5) return "warning"
		return "stable"
	}
}
