import { defineConfig } from "drizzle-kit"
import { env } from "@/env"

export default defineConfig({
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	out: "./src/db/migrations",
	schema: "./src/db/schema/index.ts",
	casing: "snake_case",
})
