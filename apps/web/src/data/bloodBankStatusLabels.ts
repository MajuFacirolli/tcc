import { BloodBankStatusEnum } from "@/enums/BloodBankStatusEnum"

export const BLOOD_BANK_STATUS_LABELS: Record<BloodBankStatusEnum, string> = {
	[BloodBankStatusEnum.STABLE]: "Estável",
	[BloodBankStatusEnum.ATTENTION]: "Atenção",
	[BloodBankStatusEnum.CRITICAL]: "Crítico",
}
