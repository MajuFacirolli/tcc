import type { FastifyInstance } from "fastify"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { authCookie, buildTestApp } from "../helpers/buildTestApp"

/**
 * Only the auth and validation edges are covered here: `_tests/setup.ts` points
 * DATABASE_URL at a mock, so a 200 would need a real database. The eligibility SQL
 * is verified separately against Postgres.
 */
describe("GET /api/donors", () => {
	let app: FastifyInstance

	beforeEach(() => {
		app = buildTestApp()
	})

	afterEach(async () => {
		await app.close()
	})

	it("requires authentication", async () => {
		const response = await app.inject({ method: "GET", url: "/api/donors" })

		expect(response.statusCode).toBe(401)
	})

	it("rejects an unknown blood type", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/api/donors?bloodType=Z%2B",
			cookies: await authCookie(app),
		})

		expect(response.statusCode).toBe(400)
		expect(response.json().message).toBeTruthy()
	})

	it("rejects a non-boolean isEligible", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/api/donors?isEligible=maybe",
			cookies: await authCookie(app),
		})

		expect(response.statusCode).toBe(400)
	})

	it("rejects a page below 1", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/api/donors?page=0",
			cookies: await authCookie(app),
		})

		expect(response.statusCode).toBe(400)
	})

	it.each([
		"",
		"?page=2",
		"?bloodType=O%2B",
		"?isEligible=true",
		"?isEligible=false",
	])("accepts the query %s", async (query) => {
		const response = await app.inject({
			method: "GET",
			url: `/api/donors${query}`,
			cookies: await authCookie(app),
		})

		// Reaches the repository and fails on the mock DB rather than on validation.
		expect(response.statusCode).not.toBe(400)
		expect(response.statusCode).not.toBe(401)
	})
})

describe("GET /api/donors/eligible-count", () => {
	let app: FastifyInstance

	beforeEach(() => {
		app = buildTestApp()
	})

	afterEach(async () => {
		await app.close()
	})

	it("requires authentication", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/api/donors/eligible-count?bloodType=O%2B",
		})

		expect(response.statusCode).toBe(401)
	})

	it("requires a blood type", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/api/donors/eligible-count",
			cookies: await authCookie(app),
		})

		expect(response.statusCode).toBe(400)
		expect(response.json().message).toBeTruthy()
	})

	it("rejects an unknown blood type", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/api/donors/eligible-count?bloodType=Z%2B",
			cookies: await authCookie(app),
		})

		expect(response.statusCode).toBe(400)
	})

	it("accepts a known blood type", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/api/donors/eligible-count?bloodType=O%2B",
			cookies: await authCookie(app),
		})

		// Reaches the repository and fails on the mock DB rather than on validation.
		expect(response.statusCode).not.toBe(400)
		expect(response.statusCode).not.toBe(401)
	})
})
