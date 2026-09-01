import { FlowProducer, type FlowJob } from "bullmq"
import type {
	EnqueueOptions,
	IJobQueue,
	Job,
} from "@application/interfaces/IJobQueue"
import type { QueueName } from "@/application/queues/queueNames"
import { redisConnection } from "./redisConnection"
import { DEFAULT_JOB_OPTIONS, queues } from "./queues"
import { MS_PER_SECOND } from "@domain/utils/dateUtils"

export class BullMqJobQueue implements IJobQueue {
	private flowProducer = new FlowProducer({
		connection: redisConnection,
	})

	async enqueue<T>(
		{ queueName, name, data }: Job<T>,
		options?: EnqueueOptions,
	): Promise<void> {
		const delay = options?.delaySeconds
			? options.delaySeconds * MS_PER_SECOND
			: undefined

		await queues[queueName].add(name, data, delay ? { delay } : undefined)
	}

	async enqueueBulk<T, C = unknown>(
		queueName: QueueName,
		jobs: Array<Omit<Job<T>, "queueName">>,
		completion?: Job<C>,
	): Promise<void> {
		if (!completion) {
			await queues[queueName].addBulk(jobs)
			return
		}

		await this.flowProducer.add(this.buildFlow(queueName, jobs, completion))
	}

	private buildFlow<T, C>(
		queueName: QueueName,
		jobs: Array<Omit<Job<T>, "queueName">>,
		completion: Job<C>,
	): FlowJob {
		return {
			name: completion.name,
			queueName: completion.queueName,
			data: completion.data,
			children: jobs.map((job) => ({
				queueName,
				name: job.name,
				data: job.data,
				opts: { ...DEFAULT_JOB_OPTIONS, failParentOnFailure: false },
			})),
		}
	}
}
