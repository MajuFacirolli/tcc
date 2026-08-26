export const SexEnum = {
	MALE: "male",
	FEMALE: "female",
} as const

export type SexEnum = (typeof SexEnum)[keyof typeof SexEnum]

export const SEXES = Object.values(SexEnum)
