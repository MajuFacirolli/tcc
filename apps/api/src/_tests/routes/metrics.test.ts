import type { FastifyInstance } from "fastify"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { authCookie, buildTestApp } from "../helpers/buildTestApp"

/**
 * Only the auth and validation edges are covered here: `_tests/setup.ts` points
 * DATABASE_URL at a mock, so a 200 would need a real database. The aggregation SQL
 * is verified separately against Postgres.
 */
describe("GET /api/metrics", () => {
	let app: FastifyInstance

	beforeEach(() => {
		app = buildTestApp()
	})

	afterEach(async () => {
		await app.close()
	})

	it("requires authentication", async () => {
		const response = await app.inject({ method: "GET", url: "/api/metrics" })

		expect(response.statusCode).toBe(401)
	})

	it("rejects an unknown period", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/api/metrics?period=decade",
			cookies: await authCookie(app),
		})

		expect(response.statusCode).toBe(400)
		expect(response.json().message).toBeTruthy()
	})

	it.each([
		"week",
		"month",
		"year",
	])("accepts the %s period", async (period) => {
		const response = await app.inject({
			method: "GET",
			url: `/api/metrics?period=${period}`,
			cookies: await authCookie(app),
		})

		// Reaches the repository and fails on the mock DB rather than on validation.
		expect(response.statusCode).not.toBe(400)
		expect(response.statusCode).not.toBe(401)
	})
})
