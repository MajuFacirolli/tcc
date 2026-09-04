import { queues } from "@infrastructure/queue/queues"
import { redisConnection } from "@infrastructure/queue/redisConnection"
import { TEST_REDIS_DB } from "../testEnv"

/**
 * `DEFAULT_JOB_OPTIONS` keeps 1000 completed jobs, so state survives between tests: a
 * leftover waiting job would be picked up by the next test's worker and mutate a
 * campaign row that no longer exists.
 */
export async function flushTestRedis() {
	if (redisConnection.options.db !== TEST_REDIS_DB)
		throw new Error(
			`Refusing to flush Redis database ${redisConnection.options.db}: the suite only owns ${TEST_REDIS_DB}`,
		)

	await redisConnection.flushdb()
}

/**
 * The producer side opens a connection eagerly at import, and `BullMqJobQueue` adds a
 * FlowProducer on top. Both have to be closed or Vitest cannot exit.
 */
export async function closeQueueInfrastructure() {
	await Promise.all(Object.values(queues).map((queue) => queue.close()))
	await redisConnection.quit()
}
