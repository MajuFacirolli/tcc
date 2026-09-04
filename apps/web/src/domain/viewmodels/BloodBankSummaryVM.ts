import { AutoMap } from "@automapper/classes"
import type { BloodTypeEnum } from "../enums/BloodTypeEnum"
import type { BloodBankStatusEnum } from "@/presentation/enums/BloodBankStatusEnum"

export class BloodBankSummaryVM {
	@AutoMap(() => String)
	type: BloodTypeEnum

	@AutoMap(() => String)
	status: BloodBankStatusEnum

	constructor(type: BloodTypeEnum, status: BloodBankStatusEnum) {
		this.type = type
		this.status = status
	}
}
