import { expect, test } from "@playwright/test"
import { API_URL } from "../env"
import { getCampaignByTitle, listConfirmations } from "../fixtures/db"

/**
 * Criterion 5, end to end — the donor's answer arriving from the link in the e-mail.
 *
 * The campaign is created through the API rather than the interface: the interface
 * path is already covered by the full-flow test, and this one is about what happens
 * after the message goes out.
 */
test.describe("registering an intention", () => {
	const title = `Confirmação E2E ${Date.now()}`
	let token: string
	let campaignId: string

	test.beforeAll(async ({ browser }) => {
		// The stored admin session, since creating a campaign is an authenticated act.
		const context = await browser.newContext({
			storageState: ".auth/admin.json",
		})

		const created = await context.request.post(`${API_URL}/campaigns`, {
			data: {
				title,
				message: "Olá, [Nome]! Confirme sua intenção.",
				kind: "segmented",
				bloodType: "O-",
			},
		})

		expect(created.status()).toBe(201)
		await context.close()

		await expect
			.poll(
				async () => (await getCampaignByTitle(title))?.notified_count ?? 0,
				{ timeout: 30_000, message: "the worker never notified anybody" },
			)
			.toBe(3)

		const campaign = await getCampaignByTitle(title)
		campaignId = campaign.id
		token = (await listConfirmations(campaignId))[0].token
	})

	// The donor opening the link has no session — that is the whole point of the token.
	test.use({ storageState: { cookies: [], origins: [] } })

	test("confirms from the link and records it once", async ({ page }) => {
		await page.goto(`/confirmacoes/${token}`)

		await expect(
			page.getByRole("heading", { name: "Intenção confirmada!" }),
		).toBeVisible()

		const confirmations = await listConfirmations(campaignId)
		const confirmed = confirmations.filter((row) => row.confirmed_at !== null)

		expect(confirmed).toHaveLength(1)
		expect(confirmed[0].token).toBe(token)

		const campaign = await getCampaignByTitle(title)
		expect(campaign.intention_confirmations_count).toBe(1)
	})

	test("opening the same link again does not count twice", async ({ page }) => {
		await page.goto(`/confirmacoes/${token}`)

		await expect(
			page.getByRole("heading", { name: "Intenção confirmada!" }),
		).toBeVisible()

		const campaign = await getCampaignByTitle(title)
		expect(campaign.intention_confirmations_count).toBe(1)
	})

	test("shows an invalid link as invalid", async ({ page }) => {
		await page.goto("/confirmacoes/token-que-nao-existe")

		await expect(
			page.getByRole("heading", { name: "Link inválido" }),
		).toBeVisible()
	})
})
