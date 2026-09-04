export const BloodTypeEnum = {
	A_POSITIVE: "A+",
	A_NEGATIVE: "A-",
	B_POSITIVE: "B+",
	B_NEGATIVE: "B-",
	AB_POSITIVE: "AB+",
	AB_NEGATIVE: "AB-",
	O_POSITIVE: "O+",
	O_NEGATIVE: "O-",
} as const

export type BloodTypeEnum = (typeof BloodTypeEnum)[keyof typeof BloodTypeEnum]

export const BLOOD_TYPES = Object.values(BloodTypeEnum)
