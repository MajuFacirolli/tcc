export const BloodBankStatusEnum = {
	STABLE: 1,
	ATTENTION: 2,
	CRITICAL: 3,
} as const

export type BloodBankStatusEnum =
	(typeof BloodBankStatusEnum)[keyof typeof BloodBankStatusEnum]
