import { drizzle } from "drizzle-orm/node-postgres"
import { env } from "@/env"
import * as schema from "./schema/index"

export const db = drizzle(env.DATABASE_URL, {
	casing: "snake_case",
	schema,
})
