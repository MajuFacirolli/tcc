import { Queue, type JobsOptions } from "bullmq"
import { QUEUE_NAMES, type QueueName } from "@/application/queues/queueNames"
import { redisConnection } from "./redisConnection"

export const DEFAULT_JOB_OPTIONS: JobsOptions = {
	attempts: 3,
	backoff: { type: "exponential", delay: 5000 },
	removeOnComplete: 1000,
	removeOnFail: 5000,
}

export const queues: Record<QueueName, Queue> = Object.fromEntries(
	Object.values(QUEUE_NAMES).map((name) => [
		name,
		new Queue(name, {
			connection: redisConnection,
			defaultJobOptions: DEFAULT_JOB_OPTIONS,
		}),
	]),
) as Record<QueueName, Queue>
