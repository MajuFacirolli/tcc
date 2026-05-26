import { pgEnum } from "drizzle-orm/pg-core"
import { SEXES } from "@/@types/Sex"

export const sexEnum = pgEnum("sex", SEXES)
