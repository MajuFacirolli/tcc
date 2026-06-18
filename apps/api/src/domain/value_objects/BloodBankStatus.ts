export const BLOOD_BANK_STATUSES = ["stable", "warning", "critical"] as const

export type BloodBankStatus = (typeof BLOOD_BANK_STATUSES)[number]
