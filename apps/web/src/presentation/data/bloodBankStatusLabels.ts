import { BloodBankStatusEnum } from "@/presentation/enums/BloodBankStatusEnum"

export const BLOOD_BANK_STATUS_LABELS: Record<BloodBankStatusEnum, string> = {
	[BloodBankStatusEnum.STABLE]: "Estável",
	[BloodBankStatusEnum.WARNING]: "Atenção",
	[BloodBankStatusEnum.CRITICAL]: "Crítico",
}
