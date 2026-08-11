import type { Job } from "bullmq"
import type { QueueName } from "@/application/queues/queueNames"

export type JobDefinition<T> = {
	queueName: QueueName
	concurrency: number
	process(job: Job<T>): Promise<void>
}
