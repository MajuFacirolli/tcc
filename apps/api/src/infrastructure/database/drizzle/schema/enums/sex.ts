import { pgEnum } from "drizzle-orm/pg-core"
import { SEXES } from "@domain/value_objects/Sex"

export const sexEnum = pgEnum("sex", SEXES)
