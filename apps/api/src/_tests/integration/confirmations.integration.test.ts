import type { FastifyInstance } from "fastify"
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"
import { TYPES } from "@/container/types"
import { closeDatabase, truncateAll } from "./helpers/database"
import { closeQueueInfrastructure, flushTestRedis } from "./helpers/redis"
import { buildIntegrationApp } from "./helpers/buildIntegrationApp"
import { RecordingEmailService } from "./helpers/RecordingEmailService"
import {
	eligibleDonor,
	getCampaign,
	insertCampaign,
	insertConfirmation,
	insertDonors,
	listConfirmations,
} from "./helpers/fixtures"

/**
 * Criterion 5 — intention registration: receiving the donor's answer and updating it
 * in the database.
 *
 * The route is the one a donor's e-mail link opens, so it is exercised without any
 * session cookie.
 */
describe("intention registration", () => {
	let app: FastifyInstance

	beforeAll(async () => {
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

	const confirm = (token: string) =>
		app.inject({ method: "POST", url: `/api/confirmations/${token}` })

	async function notifiedDonor(secondsAgo: number, token = "token-1") {
		await insertDonors([eligibleDonor("d1", "O-")])
		const campaignId = await insertCampaign({ totalEligibleDonors: 1 })
		await insertConfirmation({
			token,
			campaignId,
			donorId: "d1",
			notifiedSecondsAgo: secondsAgo,
		})
		return campaignId
	}

	it("records the answer without any session, as the donor's link does", async () => {
		const campaignId = await notifiedDonor(120)

		const response = await confirm("token-1")

		expect(response.statusCode).toBe(200)
		expect(response.json().data).toMatchObject({ alreadyConfirmed: false })

		const [confirmation] = await listConfirmations(campaignId)
		expect(confirmation.confirmedAt).toBeInstanceOf(Date)

		const campaign = await getCampaign(campaignId)
		expect(campaign.intentionConfirmationsCount).toBe(1)
		// Response time is measured from the notification, in seconds.
		expect(campaign.averageResponseTime).toBeGreaterThanOrEqual(118)
		expect(campaign.averageResponseTime).toBeLessThanOrEqual(122)
	})

	it("does not count the same answer twice", async () => {
		const campaignId = await notifiedDonor(60)

		const first = await confirm("token-1")
		const second = await confirm("token-1")

		expect(second.statusCode).toBe(200)
		expect(second.json().data.alreadyConfirmed).toBe(true)
		// The instant of the original answer is preserved, not overwritten.
		expect(second.json().data.confirmedAt).toBe(first.json().data.confirmedAt)

		const campaign = await getCampaign(campaignId)
		expect(campaign.intentionConfirmationsCount).toBe(1)
	})

	it("rejects a token that does not exist", async () => {
		const response = await confirm("nao-existe")

		expect(response.statusCode).toBe(404)
	})

	it("keeps a running average across several answers", async () => {
		await insertDonors([
			eligibleDonor("d1", "O-"),
			eligibleDonor("d2", "O-"),
			eligibleDonor("d3", "O-"),
		])
		const campaignId = await insertCampaign({ totalEligibleDonors: 3 })

		for (const [index, seconds] of [60, 120, 180].entries()) {
			await insertConfirmation({
				token: `token-${index}`,
				campaignId,
				donorId: `d${index + 1}`,
				notifiedSecondsAgo: seconds,
			})
		}

		for (const index of [0, 1, 2]) await confirm(`token-${index}`)

		const campaign = await getCampaign(campaignId)

		expect(campaign.intentionConfirmationsCount).toBe(3)
		// (60 + 120 + 180) / 3, folded in one answer at a time by the SQL average.
		expect(campaign.averageResponseTime).toBeGreaterThanOrEqual(118)
		expect(campaign.averageResponseTime).toBeLessThanOrEqual(122)
	})

	/**
	 * `confirm` reads the confirmation and only then opens the transaction that writes
	 * it, so two simultaneous clicks can both pass the "already confirmed?" check.
	 *
	 * The assertion is deliberately written as "never more than one answer counted",
	 * which is the property the metrics depend on. If this fails, it is a real defect
	 * in the confirmation path and worth reporting as such — not a flaky test.
	 */
	it("counts one answer even when the link is opened twice at once", async () => {
		const campaignId = await notifiedDonor(90)

		await Promise.all([confirm("token-1"), confirm("token-1")])

		const campaign = await getCampaign(campaignId)

		expect(campaign.intentionConfirmationsCount).toBe(1)
	})
})
