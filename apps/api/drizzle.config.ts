import { defineConfig } from "drizzle-kit"
import { env } from "@/env"

export default defineConfig({
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	out: "./src/infrastructure/database/drizzle/migrations",
	schema: "./src/infrastructure/database/drizzle/schema/index.ts",
	casing: "snake_case",
})
