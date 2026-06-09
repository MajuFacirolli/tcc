import { pgEnum } from "drizzle-orm/pg-core"
import { BLOOD_TYPES } from "@domain/value_objects/BloodType"

export const bloodTypeEnum = pgEnum("blood_type", BLOOD_TYPES)
