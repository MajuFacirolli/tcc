import { AutoMap } from "@automapper/classes"

import type { BloodBankStatusEnum } from "@/presentation/enums/BloodBankStatusEnum"
import type { BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"

export class BloodBankSummaryResponse {
	@AutoMap(() => String)
	id: BloodTypeEnum

	@AutoMap(() => String)
	status: BloodBankStatusEnum

	constructor(id: BloodTypeEnum, status: BloodBankStatusEnum) {
		this.id = id
		this.status = status
	}
}
