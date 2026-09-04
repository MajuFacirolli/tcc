import type { BloodBank } from "@/domain/entities/BloodBank"
import type { BloodBankStatus } from "@/domain/value_objects/BloodBankStatus"
import type { BloodType } from "@/domain/value_objects/BloodType"

export type GetBloodBankSummaryOutput = {
	id: BloodType
	status: BloodBankStatus
}

export function toBloodBankSummaryOutput(
	bloodBank: BloodBank,
): GetBloodBankSummaryOutput {
	return {
		id: bloodBank.id,
		status: bloodBank.status,
	}
}
