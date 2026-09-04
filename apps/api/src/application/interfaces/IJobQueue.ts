import type { QueueName } from "@/application/queues/queueNames"
import type { JobName } from "../queues/jobNames"

export type Job<T> = {
	queueName: QueueName
	name: JobName
	data: T
}

export interface IJobQueue {
	enqueueBulk<T, C = unknown>(
		queueName: QueueName,
		jobs: Array<Omit<Job<T>, "queueName">>,
		completion?: Job<C>,
	): Promise<void>
}
