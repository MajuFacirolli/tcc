import type { FastifyInstance } from "fastify"
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"
import { TYPES } from "@/container/types"
import { queues } from "@infrastructure/queue/queues"
import { QUEUE_NAMES } from "@/application/queues/queueNames"
import { authCookie } from "../helpers/buildTestApp"
import { closeDatabase, truncateAll } from "./helpers/database"
import { closeQueueInfrastructure, flushTestRedis } from "./helpers/redis"
import { buildIntegrationApp } from "./helpers/buildIntegrationApp"
import { RecordingEmailService } from "./helpers/RecordingEmailService"
import {
	eligibleDonor,
	getCampaign,
	insertDonors,
	listCampaigns,
	waitingDonor,
} from "./helpers/fixtures"

/**
 * Criterion 3 — campaign generation: creation, parameters and persistence.
 *
 * Everything below goes through the HTTP route against a real Postgres, so the zod
 * body schema, the audience rule, the Drizzle repository and the column defaults are
 * all exercised. No worker runs here: this file is about what is written, not what is
 * dispatched.
 */
describe("campaign creation", () => {
	let app: FastifyInstance

	beforeAll(async () => {
		// The rebind has to precede buildApp: routes resolve their controller when the
		// plugin is registered.
		app = buildIntegrationApp([
			[TYPES.IEmailService, new RecordingEmailService()],
		])
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
		await closeQueueInfrastructure()
		await closeDatabase()
	})

	beforeEach(async () => {
		await flushTestRedis()
		await truncateAll()
	})

	async function create(body: Record<string, unknown>) {
		return app.inject({
			method: "POST",
			url: "/api/campaigns",
			cookies: await authCookie(app),
			payload: body,
		})
	}

	it("persists every parameter of a segmented campaign", async () => {
		await insertDonors([
			eligibleDonor("d1", "O-"),
			eligibleDonor("d2", "O-", "female"),
			waitingDonor("d3", "O-"),
			eligibleDonor("d4", "A+"),
		])

		const response = await create({
			title: "Convocação O negativo",
			message: "Olá, [Nome]! Precisamos de você.",
			kind: "segmented",
			bloodType: "O-",
		})

		expect(response.statusCode).toBe(201)

		const campaignId = response.json().data
		expect(typeof campaignId).toBe("string")

		const campaign = await getCampaign(campaignId)

		expect(campaign).toMatchObject({
			title: "Convocação O negativo",
			// Stored verbatim: the [Nome] placeholder is only resolved per donor at
			// send time, never at creation.
			message: "Olá, [Nome]! Precisamos de você.",
			bloodType: "O-",
			kind: "segmented",
			status: "active",
		})

		// Two O- donors are past their own interval; the third is still waiting and the
		// A+ donor is another type entirely.
		expect(campaign.totalEligibleDonors).toBe(2)

		// Counters start empty — nothing has been dispatched or answered yet.
		expect(campaign.notifiedCount).toBe(0)
		expect(campaign.intentionConfirmationsCount).toBe(0)
		expect(campaign.averageResponseTime).toBe(0)
		expect(campaign.createdAt).toBeInstanceOf(Date)
	})

	it("stores no blood type for a generic campaign, even when one is sent", async () => {
		await insertDonors([eligibleDonor("d1", "O-"), waitingDonor("d2", "A+")])

		const response = await create({
			title: "Convocação geral",
			message: "Todos são bem-vindos",
			kind: "generic",
			bloodType: "O-",
		})

		expect(response.statusCode).toBe(201)

		const campaign = await getCampaign(response.json().data)

		expect(campaign.bloodType).toBeNull()
		expect(campaign.kind).toBe("generic")
		// A generic campaign reaches everyone, but only the eligible could answer.
		expect(campaign.totalEligibleDonors).toBe(1)
	})

	it("creates a campaign already closed when nobody can be reached", async () => {
		await insertDonors([waitingDonor("d1", "O-"), eligibleDonor("d2", "A+")])

		const response = await create({
			title: "Sem público",
			message: "Olá",
			kind: "segmented",
			bloodType: "O-",
		})

		expect(response.statusCode).toBe(201)

		const campaign = await getCampaign(response.json().data)

		expect(campaign.status).toBe("closed")
		expect(campaign.totalEligibleDonors).toBe(0)

		// Nothing was queued, so no worker will ever try to send for it.
		const counts = await queues[QUEUE_NAMES.CAMPAIGN_EMAIL].getJobCounts(
			"waiting",
			"delayed",
			"active",
		)
		expect(Object.values(counts).reduce((a, b) => a + b, 0)).toBe(0)
	})

	it("rejects a segmented campaign without a blood type and writes nothing", async () => {
		await insertDonors([eligibleDonor("d1", "O-")])

		const response = await create({
			title: "Sem tipo",
			message: "Olá",
			kind: "segmented",
		})

		expect(response.statusCode).toBe(400)
		expect(await listCampaigns()).toHaveLength(0)
	})

	it("requires authentication", async () => {
		const response = await app.inject({
			method: "POST",
			url: "/api/campaigns",
			payload: { title: "x", message: "y", kind: "generic" },
		})

		expect(response.statusCode).toBe(401)
		expect(await listCampaigns()).toHaveLength(0)
	})

	it("returns the persisted campaign through the listing endpoint", async () => {
		await insertDonors([eligibleDonor("d1", "B+")])

		const created = await create({
			title: "Convocação B positivo",
			message: "Olá, [Nome]!",
			kind: "segmented",
			bloodType: "B+",
		})

		const response = await app.inject({
			method: "GET",
			url: "/api/campaigns?page=1",
			cookies: await authCookie(app),
		})

		expect(response.statusCode).toBe(200)

		const { items } = response.json().data

		expect(items).toHaveLength(1)
		expect(items[0]).toMatchObject({
			id: created.json().data,
			title: "Convocação B positivo",
			bloodType: "B+",
			kind: "segmented",
		})
	})
})
