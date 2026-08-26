import { SEXES } from "@/domain/value_objects/Sex"
import { z } from "zod"
import { bloodTypeSchema } from "./bloodType"

export const sexSchema = z.enum(SEXES)

export const donorSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.email(),
	sex: sexSchema,
	bloodType: bloodTypeSchema,
	lastDonationDate: z.iso.datetime().nullable(),
	isEligible: z.boolean(),
})

/** Absent means "no eligibility filter", which reaches the use case as `null`. */
export const isEligibleQuerySchema = z
	.enum(["true", "false"])
	.nullish()
	.default(null)
	.transform((value) => (value == null ? null : value === "true"))
