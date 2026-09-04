import { spawn } from "node:child_process"
import { execFileSync } from "node:child_process"
import { rm } from "node:fs/promises"
import { apiEnv } from "./env"

/**
 * Brings up what Playwright's `webServer` cannot.
 *
 * The database is prepared before the API starts, and the dispatch worker is spawned
 * here because it serves no HTTP and so has no URL for Playwright to poll. The stored
 * session is deleted first: its JWT would still verify after a re-seed, but it names a
 * user that no longer exists, and every test would silently bounce to the login page.
 */
export default async function globalSetup() {
	await rm(new URL("./.auth", import.meta.url), {
		recursive: true,
		force: true,
	})

	execFileSync("pnpm", ["exec", "tsx", "src/_tests/e2e/prepare.ts"], {
		cwd: new URL("../api", import.meta.url).pathname,
		env: { ...process.env, ...apiEnv },
		stdio: "inherit",
	})

	const worker = spawn("pnpm", ["exec", "tsx", "src/_tests/e2e/worker.ts"], {
		cwd: new URL("../api", import.meta.url).pathname,
		env: { ...process.env, ...apiEnv },
		stdio: ["ignore", "pipe", "inherit"],
	})

	await new Promise<void>((resolve, reject) => {
		const timer = setTimeout(
			() => reject(new Error("The dispatch worker never reported ready")),
			60_000,
		)

		worker.stdout.on("data", (chunk: Buffer) => {
			process.stdout.write(chunk)
			if (chunk.toString().includes("E2E_WORKER_READY")) {
				clearTimeout(timer)
				resolve()
			}
		})

		worker.on("exit", (code) => {
			clearTimeout(timer)
			reject(new Error(`The dispatch worker exited early with code ${code}`))
		})
	})

	return async () => {
		worker.kill("SIGTERM")
	}
}
