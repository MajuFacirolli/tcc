import { Worker } from "bullmq"
import type IORedis from "ioredis"
import { jobDefinitions } from "@infrastructure/queue/jobDefinitions"
import { createRedisConnection } from "@infrastructure/queue/redisConnection"

/**
 * Runs the real workers, from the same `jobDefinitions` the `dev:worker` process uses.
 *
 * Each worker gets its own connection from the exported factory rather than the shared
 * singleton: BullMQ needs a blocking connection per worker, and closing a worker must
 * not tear down the producer's.
 *
 * The job handlers resolve their use case from the container inside `process()`, so a
 * rebind applied at any point before a job runs is honoured.
 */
export async function startWorkers() {
	const connections: IORedis[] = []
	const failures: Error[] = []

	const workers = jobDefinitions.map((definition) => {
		const connection = createRedisConnection()
		connections.push(connection)

		const worker = new Worker(definition.queueName, definition.process, {
			connection,
			concurrency: definition.concurrency,
		})

		worker.on("failed", (_job, error) => failures.push(error))

		return worker
	})

	await Promise.all(workers.map((worker) => worker.waitUntilReady()))

	return {
		/** Reported in a timeout message, so a retrying job does not look like a hang. */
		describeFailures: () =>
			failures.length === 0
				? "No job reported a failure."
				: `Jobs failed: ${failures.map((error) => error.message).join("; ")}`,
		async stop() {
			await Promise.all(workers.map((worker) => worker.close()))
			await Promise.all(connections.map((connection) => connection.quit()))
		},
	}
}
