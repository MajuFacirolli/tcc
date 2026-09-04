import { expect, test as setup } from "@playwright/test"
import { ADMIN } from "../env"

const SESSION_FILE = ".auth/admin.json"

/**
 * Signs in once and stores the session for every other test.
 *
 * Sign-in is rate limited to ten a minute, so authenticating per test would eventually
 * start returning 429 and look like a broken login.
 */
setup("authenticate", async ({ page }) => {
	await page.goto("/login")

	await page.getByLabel("E-mail").fill(ADMIN.email)
	await page.getByLabel("Senha").fill(ADMIN.password)
	await page.getByRole("button", { name: "Entrar" }).click()

	// The dashboard only renders once /auth/profile succeeds, so arriving here proves
	// the session cookie survived the cross-origin round trip.
	await expect(page).toHaveURL("/")

	await page.context().storageState({ path: SESSION_FILE })
})
