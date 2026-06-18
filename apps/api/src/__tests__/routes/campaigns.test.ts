import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { FastifyReply, FastifyRequest } from "fastify"
import { NotFoundError } from "@/core/errors/NotFoundError"
import { buildTestApp } from "../helpers/buildTestApp"

const mockGetCampaigns = vi.fn()
const mockGetCampaignsSummary = vi.fn()
const mockGetCampaign = vi.fn()
const mockCreateCampaign = vi.fn()

vi.mock("@/container/Ioc.config", async () => {
	const { TYPES } = await import("../../container/types.js")
	return {
		container: {
			get: (type: symbol) => {
				if (type === TYPES.GetCampaignsController)
					return { handle: mockGetCampaigns }
				if (type === TYPES.GetCampaignsSummaryController)
					return { handle: mockGetCampaignsSummary }
				if (type === TYPES.GetCampaignController)
					return { handle: mockGetCampaign }
				if (type === TYPES.CreateCampaignController)
					return { handle: mockCreateCampaign }
			},
		},
	}
})

const fakeCampaign = {
	id: "01932b8e-0000-7000-8000-000000000001",
	title: "Campanha A+",
	message: "Precisamos de doadores A+",
	bloodType: "A+",
	status: "active",
	notifiedCount: 100,
	confirmationsCount: 30,
	conversionRate: 0.3,
	createdAt: new Date().toISOString(),
}

const fakeSummary = {
	id: "01932b8e-0000-7000-8000-000000000001",
	title: "Campanha A+",
	bloodType: "A+",
	notifiedCount: 100,
	conversionRate: 0.3,
}

describe("GET /api/campaigns", () => {
	let app: ReturnType<typeof buildTestApp>

	beforeEach(() => {
		app = buildTestApp()
		vi.clearAllMocks()
	})

	afterEach(async () => {
		await app.close()
	})

	it("returns 200 with an array of campaigns", async () => {
		mockGetCampaigns.mockImplementation(
			async (_req: FastifyRequest, reply: FastifyReply) => {
				return reply.status(200).send({ data: [fakeCampaign], status: 200 })
			},
		)

		const response = await app.inject({ method: "GET", url: "/api/campaigns" })

		expect(response.statusCode).toBe(200)
		const body = response.json()
		expect(body.status).toBe(200)
		expect(body.data).toHaveLength(1)
		expect(body.data[0].id).toBe(fakeCampaign.id)
	})

	it("returns 200 with empty array when no campaigns exist", async () => {
		mockGetCampaigns.mockImplementation(
			async (_req: FastifyRequest, reply: FastifyReply) => {
				return reply.status(200).send({ data: [], status: 200 })
			},
		)

		const response = await app.inject({ method: "GET", url: "/api/campaigns" })

		expect(response.statusCode).toBe(200)
		expect(response.json().data).toEqual([])
	})

	it("passes status query param to the controller", async () => {
		mockGetCampaigns.mockImplementation(
			async (
				req: FastifyRequest<{ Querystring: { status?: string } }>,
				reply: FastifyReply,
			) => {
				expect(req.query.status).toBe("active")
				return reply.status(200).send({ data: [], status: 200 })
			},
		)

		const response = await app.inject({
			method: "GET",
			url: "/api/campaigns?status=active",
		})

		expect(response.statusCode).toBe(200)
	})

	it("passes bloodType query param to the controller", async () => {
		mockGetCampaigns.mockImplementation(
			async (
				req: FastifyRequest<{ Querystring: { bloodType?: string } }>,
				reply: FastifyReply,
			) => {
				expect(req.query.bloodType).toBe("A+")
				return reply.status(200).send({ data: [], status: 200 })
			},
		)

		const response = await app.inject({
			method: "GET",
			url: "/api/campaigns?bloodType=A%2B",
		})

		expect(response.statusCode).toBe(200)
	})

	it("returns 400 for an invalid status value", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/api/campaigns?status=invalid",
		})

		expect(response.statusCode).toBe(400)
		const body = response.json()
		expect(body.data).toBeNull()
		expect(body.status).toBe(400)
	})

	it("returns 400 for an invalid bloodType value", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/api/campaigns?bloodType=Z-",
		})

		expect(response.statusCode).toBe(400)
		const body = response.json()
		expect(body.data).toBeNull()
		expect(body.status).toBe(400)
	})
})

describe("GET /api/campaigns/summary", () => {
	let app: ReturnType<typeof buildTestApp>

	beforeEach(() => {
		app = buildTestApp()
		vi.clearAllMocks()
	})

	afterEach(async () => {
		await app.close()
	})

	it("returns 200 with a summary array", async () => {
		mockGetCampaignsSummary.mockImplementation(
			async (_req: FastifyRequest, reply: FastifyReply) => {
				return reply.status(200).send({ data: [fakeSummary], status: 200 })
			},
		)

		const response = await app.inject({
			method: "GET",
			url: "/api/campaigns/summary",
		})

		expect(response.statusCode).toBe(200)
		const body = response.json()
		expect(body.data).toHaveLength(1)
		expect(body.data[0].id).toBe(fakeSummary.id)
	})

	it("returns 404 when the controller throws NotFoundError", async () => {
		mockGetCampaignsSummary.mockImplementation(async () => {
			throw new NotFoundError(new Error("No campaigns found"))
		})

		const response = await app.inject({
			method: "GET",
			url: "/api/campaigns/summary",
		})

		expect(response.statusCode).toBe(404)
		const body = response.json()
		expect(body.data).toBeNull()
		expect(body.status).toBe(404)
	})
})

describe("GET /api/campaigns/:id", () => {
	let app: ReturnType<typeof buildTestApp>

	beforeEach(() => {
		app = buildTestApp()
		vi.clearAllMocks()
	})

	afterEach(async () => {
		await app.close()
	})

	it("returns 200 with the campaign", async () => {
		mockGetCampaign.mockImplementation(
			async (_req: FastifyRequest, reply: FastifyReply) => {
				return reply.status(200).send({ data: fakeCampaign, status: 200 })
			},
		)

		const response = await app.inject({
			method: "GET",
			url: `/api/campaigns/${fakeCampaign.id}`,
		})

		expect(response.statusCode).toBe(200)
		expect(response.json().data.id).toBe(fakeCampaign.id)
	})

	it("returns 404 when the controller throws NotFoundError", async () => {
		mockGetCampaign.mockImplementation(async () => {
			throw new NotFoundError(new Error("Campaign not found"))
		})

		const response = await app.inject({
			method: "GET",
			url: "/api/campaigns/nonexistent-id",
		})

		expect(response.statusCode).toBe(404)
		const body = response.json()
		expect(body.data).toBeNull()
		expect(body.status).toBe(404)
		expect(body.message).toBe("Campaign not found")
	})

	it("returns 500 when the controller throws an unexpected error", async () => {
		mockGetCampaign.mockImplementation(async () => {
			throw new Error("Unexpected failure")
		})

		const response = await app.inject({
			method: "GET",
			url: "/api/campaigns/some-id",
		})

		expect(response.statusCode).toBe(500)
		const body = response.json()
		expect(body.data).toBeNull()
		expect(body.status).toBe(500)
		expect(body.message).toBe("Internal Server Error")
	})
})

describe("POST /api/campaigns", () => {
	let app: ReturnType<typeof buildTestApp>

	beforeEach(() => {
		app = buildTestApp()
		vi.clearAllMocks()
	})

	afterEach(async () => {
		await app.close()
	})

	it("returns 201 with the new campaign ID", async () => {
		const newId = "01932b8e-0000-7000-8000-000000000002"
		mockCreateCampaign.mockImplementation(
			async (_req: FastifyRequest, reply: FastifyReply) => {
				return reply.status(201).send({ data: newId, status: 201 })
			},
		)

		const response = await app.inject({
			method: "POST",
			url: "/api/campaigns",
			payload: {
				title: "Nova campanha",
				message: "Precisamos de doadores",
				bloodType: "O+",
			},
		})

		expect(response.statusCode).toBe(201)
		expect(response.json().data).toBe(newId)
	})

	it("returns 400 when title is missing", async () => {
		const response = await app.inject({
			method: "POST",
			url: "/api/campaigns",
			payload: { message: "Precisamos de doadores", bloodType: "O+" },
		})

		expect(response.statusCode).toBe(400)
		const body = response.json()
		expect(body.data).toBeNull()
		expect(body.status).toBe(400)
	})

	it("returns 400 when bloodType is missing", async () => {
		const response = await app.inject({
			method: "POST",
			url: "/api/campaigns",
			payload: { title: "Nova campanha", message: "Precisamos de doadores" },
		})

		expect(response.statusCode).toBe(400)
		expect(response.json().data).toBeNull()
	})

	it("returns 400 when bloodType is not a valid value", async () => {
		const response = await app.inject({
			method: "POST",
			url: "/api/campaigns",
			payload: {
				title: "Nova campanha",
				message: "Precisamos de doadores",
				bloodType: "Z+",
			},
		})

		expect(response.statusCode).toBe(400)
		expect(response.json().data).toBeNull()
	})
})
