import "reflect-metadata"
import { Worker } from "bullmq"
import { createRedisConnection } from "@infrastructure/queue/redisConnection"
import { jobDefinitions } from "@infrastructure/queue/jobDefinitions"

const workers = jobDefinitions.map(
	(definition) =>
		new Worker(definition.queueName, definition.process, {
			connection: createRedisConnection(),
			concurrency: definition.concurrency,
		}),
)

workers.forEach((worker) => {
	worker.on("completed", (job) => {
		console.log(`✅ [${worker.name}] job ${job.id} completed`)
	})
	worker.on("failed", (job, err) => {
		console.error(`❌ [${worker.name}] job ${job?.id} failed:`, err)
	})
})

console.log(
	`📨 Worker started for queues: ${jobDefinitions.map((definition) => definition.queueName).join(", ")}`,
)

async function shutdown() {
	await Promise.all(workers.map((worker) => worker.close()))
	process.exit(0)
}

process.on("SIGTERM", shutdown)
process.on("SIGINT", shutdown)
