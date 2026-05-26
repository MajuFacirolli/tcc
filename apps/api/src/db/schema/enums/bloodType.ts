import { pgEnum } from "drizzle-orm/pg-core"
import { BLOOD_TYPES } from "@/@types/BloodType"

export const bloodTypeEnum = pgEnum("blood_type", BLOOD_TYPES)
