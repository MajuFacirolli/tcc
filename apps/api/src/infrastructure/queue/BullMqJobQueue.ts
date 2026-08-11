import type { IJobQueue } from "@application/interfaces/IJobQueue"
import type { QueueName } from "@/application/queues/queueNames"
import { queues } from "./queues"

export class BullMqJobQueue implements IJobQueue {
	async enqueue<T>(
		queueName: QueueName,
		jobName: string,
		data: T,
	): Promise<void> {
		await queues[queueName].add(jobName, data)
	}

	async enqueueBulk<T>(
		queueName: QueueName,
		jobs: Array<{ name: string; data: T }>,
	): Promise<void> {
		await queues[queueName].addBulk(jobs)
	}
}
