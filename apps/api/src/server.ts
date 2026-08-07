import { buildApp } from "@/app"
import { env } from "@/env"

const app = buildApp()

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
	console.log(`🚀 HTTP server running on http://localhost:${env.PORT}`)
	console.log(`📚 Docs available at http://localhost:${env.PORT}/docs`)
})
