import type { FastifyInstance } from "fastify"
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"
import { TYPES } from "@/container/types"
import { env } from "@/env"
import { JOB_NAMES } from "@/application/queues/jobNames"
import { QUEUE_NAMES } from "@/application/queues/queueNames"
import { queues } from "@infrastructure/queue/queues"
import { authCookie } from "../helpers/buildTestApp"
import { closeDatabase, truncateAll } from "./helpers/database"
import { closeQueueInfrastructure, flushTestRedis } from "./helpers/redis"
import { buildIntegrationApp } from "./helpers/buildIntegrationApp"
import { RecordingEmailService } from "./helpers/RecordingEmailService"
import { startWorkers } from "./helpers/runWorkers"
import { waitFor } from "./helpers/waitFor"
import {
	eligibleDonor,
	getCampaign,
	insertDonors,
	listConfirmations,
	waitingDonor,
} from "./helpers/fixtures"

/**
 * Criterion 4 — dispatch processing: the BullMQ/Redis queue and message assembly.
 *
 * Redis is real and the workers are the same ones `dev:worker` runs. Only the SMTP
 * transport is substituted: the React Email renderer stays real, because the assembled
 * body is exactly what this criterion is about.
 */
describe("campaign dispatch", () => {
	let app: FastifyInstance
	let emails: RecordingEmailService
	let workers: Awaited<ReturnType<typeof startWorkers>> | undefined

	const RECIPIENTS = [
		eligibleDonor("d1", "O-"),
		eligibleDonor("d2", "O-", "female"),
		eligibleDonor("d3", "O-"),
	]

	beforeAll(async () => {
		emails = new RecordingEmailService()
		app = buildIntegrationApp([[TYPES.IEmailService, emails]])
		await app.ready()
	})

	afterAll(async () => {
		await workers?.stop()
		await app.close()
		await closeQueueInfrastructure()
		await closeDatabase()
	})

	beforeEach(async () => {
		await workers?.stop()
		workers = undefined
		await flushTestRedis()
		await truncateAll()
		emails.clear()
	})

	async function createCampaign(message = "Olá, [Nome]! Precisamos de você.") {
		const response = await app.inject({
			method: "POST",
			url: "/api/campaigns",
			cookies: await authCookie(app),
			payload: {
				title: "Convocação O negativo",
				message,
				kind: "segmented",
				bloodType: "O-",
			},
		})

		expect(response.statusCode).toBe(201)
		return response.json().data as string
	}

	it("enqueues one e-mail per recipient under a close-campaign parent", async () => {
		await insertDonors([...RECIPIENTS, waitingDonor("d4", "O-")])

		const campaignId = await createCampaign()

		// Inspected before any worker starts, so the queue's own structure is the
		// assertion rather than its after-effects.
		const emailJobs = await queues[QUEUE_NAMES.CAMPAIGN_EMAIL].getJobs([
			"waiting",
			"delayed",
		])

		expect(emailJobs).toHaveLength(3)
		expect(
			emailJobs.every((job) => job.name === JOB_NAMES.SEND_CAMPAIGN_EMAIL),
		).toBe(true)

		// Every fact the worker needs travels with the job, so it makes no query.
		expect(emailJobs[0].data).toMatchObject({
			campaignId,
			campaignTitle: "Convocação O negativo",
		})
		expect(emailJobs.map((job) => job.data.donorId).sort()).toEqual([
			"d1",
			"d2",
			"d3",
		])

		const [parent] = await queues[QUEUE_NAMES.CAMPAIGN_LIFECYCLE].getJobs([
			"waiting-children",
			"waiting",
		])

		expect(parent.name).toBe(JOB_NAMES.CLOSE_CAMPAIGN)
		expect(parent.data).toBe(campaignId)
	})

	it("records a notification per recipient and closes the campaign", async () => {
		await insertDonors([...RECIPIENTS, waitingDonor("d4", "O-")])

		const campaignId = await createCampaign()
		workers = await startWorkers()

		// The close-campaign job is the flow's parent, so `closed` is the queue telling
		// us every child finished — a stronger signal than counting jobs.
		await waitFor(
			async () => {
				const campaign = await getCampaign(campaignId)
				return campaign.status === "closed" && campaign.notifiedCount === 3
			},
			{ describe: () => workers?.describeFailures() ?? "" },
		)

		const confirmations = await listConfirmations(campaignId)

		expect(confirmations).toHaveLength(3)
		expect(confirmations.map((row) => row.donorId).sort()).toEqual([
			"d1",
			"d2",
			"d3",
		])
		// Issued but unanswered: the donor has not clicked anything yet.
		expect(confirmations.every((row) => row.confirmedAt === null)).toBe(true)
		expect(new Set(confirmations.map((row) => row.token)).size).toBe(3)
	})

	it("assembles a message addressed and personalised per donor", async () => {
		await insertDonors(RECIPIENTS)

		const campaignId = await createCampaign()
		workers = await startWorkers()

		await waitFor(async () => emails.sent.length === 3, {
			describe: () => workers?.describeFailures() ?? "",
		})

		expect(emails.sent.map((message) => message.to).sort()).toEqual([
			"d1@example.com",
			"d2@example.com",
			"d3@example.com",
		])

		const confirmations = await listConfirmations(campaignId)
		const tokenByDonor = new Map(
			confirmations.map((row) => [row.donorId, row.token]),
		)

		for (const donor of RECIPIENTS) {
			const message = emails.find(`${donor.id}@example.com`)

			if (!message) throw new Error(`No message sent to ${donor.id}`)

			expect(message.subject).toBe("Convocação O negativo")

			// Proof the real renderer ran rather than a stub.
			expect(message.html).toContain("<html")

			// The link the donor clicks, exactly as createConfirmationLink builds it.
			expect(message.html).toContain(
				`${env.WEB_ORIGIN}/confirmacoes/${tokenByDonor.get(donor.id)}`,
			)

			// The placeholder is resolved per recipient, and none survives.
			expect(message.html).toContain(donor.name)
			expect(message.html).not.toContain("[Nome]")

			expect(message.text).toBeTruthy()
			expect(message.text).toContain(donor.name)
		}
	})

	it("reuses the token when a job is retried, so a sent link stays valid", async () => {
		await insertDonors([eligibleDonor("d1", "O-")])

		const campaignId = await createCampaign()
		workers = await startWorkers()

		await waitFor(async () => emails.sent.length === 1, {
			describe: () => workers?.describeFailures() ?? "",
		})

		const [first] = await listConfirmations(campaignId)

		// Jobs carry `attempts: 3`, so the same notification can legitimately run
		// again; the upsert must hand back the token already in the donor's inbox.
		await queues[QUEUE_NAMES.CAMPAIGN_EMAIL].add(
			JOB_NAMES.SEND_CAMPAIGN_EMAIL,
			{
				campaignId,
				campaignTitle: "Convocação O negativo",
				campaignMessage: "Olá, [Nome]! Precisamos de você.",
				donorId: "d1",
				donorEmail: "d1@example.com",
				donorName: "Apto d1",
			},
		)

		await waitFor(async () => emails.sent.length === 2, {
			describe: () => workers?.describeFailures() ?? "",
		})

		const after = await listConfirmations(campaignId)

		expect(after).toHaveLength(1)
		expect(after[0].token).toBe(first.token)
	})
})
