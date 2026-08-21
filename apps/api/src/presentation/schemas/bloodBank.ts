import { BLOOD_BANK_STATUSES } from "@/domain/value_objects/BloodBankStatus"
import { z } from "zod"
import { bloodTypeSchema } from "./bloodType"

export const bloodBankStatusSchema = z.enum(BLOOD_BANK_STATUSES)

export const bloodBankSummarySchema = z.array(
	z.object({
		id: bloodTypeSchema,
		status: bloodBankStatusSchema,
	}),
)
