import { BLOOD_TYPES } from "@/domain/value_objects/BloodType"
import { z } from "zod"

export const bloodTypeSchema = z.enum(
	BLOOD_TYPES,
	"Informe um tipo sanguíneo válido",
)
