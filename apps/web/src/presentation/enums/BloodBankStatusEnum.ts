export const BloodBankStatusEnum = {
	STABLE: "stable",
	WARNING: "warning",
	CRITICAL: "critical",
} as const

export type BloodBankStatusEnum =
	(typeof BloodBankStatusEnum)[keyof typeof BloodBankStatusEnum]
