import { afterEach, describe, expect, it } from "vitest"
import { buildTestApp } from "../helpers/buildTestApp"

describe("GET /api/health", () => {
	const app = buildTestApp()

	afterEach(async () => {
		await app.close()
	})

	it("returns 200 with a timestamp", async () => {
		const response = await app.inject({ method: "GET", url: "/api/health" })

		expect(response.statusCode).toBe(200)
		const body = response.json()
		expect(body.status).toBe(200)
		expect(body.message).toBe("Healthy")
		expect(typeof body.data.timestamp).toBe("string")
		expect(() => new Date(body.data.timestamp)).not.toThrow()
	})
})
