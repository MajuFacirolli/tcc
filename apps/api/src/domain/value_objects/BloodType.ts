export const BLOOD_TYPES = [
	"A+",
	"A-",
	"B+",
	"B-",
	"AB+",
	"AB-",
	"O+",
	"O-",
] as const

export type BloodType = (typeof BLOOD_TYPES)[number]
