import { defineConfig, devices } from "@playwright/test"
import { API_URL, apiEnv, WEB_ORIGIN, WEB_PORT } from "./env"

export default defineConfig({
	testDir: "./tests",
	// One API, one worker, one database: the suite is a single world, so it runs in
	// order rather than pretending the tests are independent.
	fullyParallel: false,
	workers: 1,
	// A test that only passes on retry is not a result worth citing.
	retries: 0,
	timeout: 60_000,
	expect: { timeout: 15_000 },
	reporter: [["list"], ["html", { open: "never" }]],
	globalSetup: "./globalSetup.ts",
	use: {
		baseURL: WEB_ORIGIN,
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
		video: "retain-on-failure",
	},
	projects: [
		{ name: "setup", testMatch: /auth\.setup\.ts/ },
		{
			name: "chromium",
			dependencies: ["setup"],
			use: { ...devices["Desktop Chrome"], storageState: ".auth/admin.json" },
		},
	],
	webServer: [
		{
			command: "pnpm exec tsx src/server.ts",
			cwd: "../api",
			env: apiEnv,
			// /api/health is unauthenticated, so it is the honest readiness probe.
			url: `${API_URL}/health`,
			reuseExistingServer: false,
			timeout: 60_000,
			stdout: "pipe",
			stderr: "pipe",
		},
		{
			command: `pnpm exec vite --port ${WEB_PORT} --strictPort`,
			cwd: "../web",
			// Overrides apps/web/.env, which points at the development API. A port
			// collision must fail loudly: drifting to another port would break CORS.
			env: { VITE_API_URL: API_URL },
			url: WEB_ORIGIN,
			reuseExistingServer: false,
			timeout: 60_000,
		},
	],
})
