import { buildApp } from "@/app"
import { env } from "@/env"

const app = buildApp()

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
	console.log(`🚀 HTTP server running on http://localhost:${env.PORT}`)
	console.log(`📚 Docs available at http://localhost:${env.PORT}/docs`)
	console.log(
		env.DASHBOARD_USER && env.DASHBOARD_PASSWORD
			? `🧰 Queue dashboard at http://localhost:${env.PORT}/dashboard`
			: "🧰 Queue dashboard not mounted (set DASHBOARD_USER and DASHBOARD_PASSWORD)",
	)
})
