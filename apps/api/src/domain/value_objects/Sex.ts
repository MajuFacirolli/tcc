export const SEXES = ["male", "female"] as const

export type Sex = (typeof SEXES)[number]
