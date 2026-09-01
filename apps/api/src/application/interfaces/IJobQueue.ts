import type { QueueName } from "@/application/queues/queueNames"
import type { JobName } from "../queues/jobNames"

export type Job<T> = {
	queueName: QueueName
	name: JobName
	data: T
}

/**
 * `delaySeconds` holds a job back before it becomes available to a worker. The
 * donation-intention simulation uses it to spread confirmations over time instead of
 * landing them all at once.
 */
export type EnqueueOptions = {
	delaySeconds?: number
}

export interface IJobQueue {
	enqueue<T>(job: Job<T>, options?: EnqueueOptions): Promise<void>
	enqueueBulk<T, C = unknown>(
		queueName: QueueName,
		jobs: Array<Omit<Job<T>, "queueName">>,
		completion?: Job<C>,
	): Promise<void>
}
