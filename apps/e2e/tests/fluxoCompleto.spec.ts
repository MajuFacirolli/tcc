import { expect, test } from "@playwright/test"
import { ADMIN } from "../env"
import { getCampaignByTitle, listConfirmations } from "../fixtures/db"

/**
 * Criterion 6 — the full flow: navigation, campaign creation and dispatch, without
 * failures.
 *
 * Logs in through the interface rather than reusing the stored session, because
 * signing in is part of the navigation this criterion covers.
 */
test.use({ storageState: { cookies: [], origins: [] } })

test("signs in, creates a campaign and sees it dispatched", async ({
	page,
}) => {
	const serverErrors: string[] = []
	page.on("response", (response) => {
		if (response.status() >= 500)
			serverErrors.push(`${response.status()} ${response.url()}`)
	})

	const title = `Convocação E2E ${Date.now()}`

	await test.step("sign in", async () => {
		await page.goto("/login")
		await page.getByLabel("E-mail").fill(ADMIN.email)
		await page.getByLabel("Senha").fill(ADMIN.password)
		await page.getByRole("button", { name: "Entrar" }).click()

		await expect(page).toHaveURL("/")
	})

	await test.step("navigate to campaigns", async () => {
		await page.getByRole("link", { name: "Campanhas" }).click()

		await expect(page).toHaveURL("/campanhas")
		await expect(
			page.getByRole("columnheader", { name: "Campanha" }),
		).toBeVisible()
	})

	await test.step("create a segmented campaign", async () => {
		await page.getByRole("link", { name: "Nova campanha" }).click()
		await expect(page).toHaveURL(/\/campanhas\/nova/)

		await page.getByLabel("Título da campanha").fill(title)

		// The radio itself is sr-only, so the visible label is what a person clicks.
		await page.getByText("Segmentado", { exact: true }).click()

		await page.getByLabel("Tipo sanguíneo").click()
		await page.getByRole("option", { name: "O-", exact: true }).click()

		await page
			.getByLabel("Conteúdo da mensagem")
			.fill("Olá, [Nome]! Seu tipo é urgente hoje.")

		await page.getByRole("button", { name: "Disparar agora" }).click()
	})

	await test.step("the campaign is listed", async () => {
		await expect(page).toHaveURL("/campanhas")
		await expect(page.getByRole("cell", { name: title })).toBeVisible()
	})

	await test.step("the worker dispatches it", async () => {
		// Three seeded O- donors are past their waiting interval; the fourth O- donor
		// is still inside it and the A+ donor is another type.
		await expect
			.poll(
				async () => {
					const campaign = await getCampaignByTitle(title)
					return campaign
						? `${campaign.status}:${campaign.notified_count}`
						: "missing"
				},
				{ timeout: 30_000, message: "campaign never finished dispatching" },
			)
			.toBe("closed:3")

		const campaign = await getCampaignByTitle(title)
		expect(campaign.total_eligible_donors).toBe(3)

		const confirmations = await listConfirmations(campaign.id)
		expect(confirmations.map((row) => row.donor_id)).toEqual([
			"e2e-1",
			"e2e-2",
			"e2e-3",
		])
	})

	await test.step("the dispatch shows in the interface", async () => {
		await page.reload()

		const row = page.getByRole("row", { name: new RegExp(title) })
		await expect(row.getByText("3", { exact: true })).toBeVisible()
	})

	expect(serverErrors).toEqual([])
})
