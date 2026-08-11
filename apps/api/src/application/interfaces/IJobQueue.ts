import type { QueueName } from "@/application/queues/queueNames"
import type { JobName } from "../queues/jobNames"

export interface IJobQueue {
	enqueue<T>(queueName: QueueName, jobName: JobName, data: T): Promise<void>
	enqueueBulk<T>(
		queueName: QueueName,
		jobs: Array<{ name: JobName; data: T }>,
	): Promise<void>
}
