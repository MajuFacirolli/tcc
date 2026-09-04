import "reflect-metadata"
import { Worker } from "bullmq"
import { jobDefinitions } from "@infrastructure/queue/jobDefinitions"
import { createRedisConnection } from "@infrastructure/queue/redisConnection"

/**
 * The dispatch worker for an end-to-end run.
 *
 * Identical in substance to `src/worker.ts` — the same job definitions, the same
 * queues — but it announces readiness on stdout so the Playwright setup can wait for
 * it instead of guessing. No message is sent: `EMAIL_TRANSPORT=noop` selects a
 * transport that delivers nowhere.
 */
const workers = jobDefinitions.map(
	(definition) =>
		new Worker(definition.queueName, definition.process, {
			connection: createRedisConnection(),
			concurrency: definition.concurrency,
		}),
)

workers.forEach((worker) => {
	worker.on("failed", (job, error) => {
		console.error(`[${worker.name}] job ${job?.id} failed:`, error.message)
	})
})

Promise.all(workers.map((worker) => worker.waitUntilReady())).then(() => {
	console.log("E2E_WORKER_READY")
})

async function shutdown() {
	await Promise.all(workers.map((worker) => worker.close()))
	process.exit(0)
}

process.on("SIGTERM", shutdown)
process.on("SIGINT", shutdown)
