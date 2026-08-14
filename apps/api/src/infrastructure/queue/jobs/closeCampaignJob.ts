import { container } from "@/container/Ioc.config"
import { TYPES } from "@/container/types"
import type { CloseCampaignUseCase } from "@application/use_cases/campaigns/CloseCampaign"
import { QUEUE_NAMES } from "@/application/queues/queueNames"
import type { JobDefinition } from "../JobDefinition"

export const closeCampaignJobDefinition: JobDefinition<string> = {
	queueName: QUEUE_NAMES.CAMPAIGN_LIFECYCLE,
	concurrency: 5,
	async process(job) {
		const useCase = container.get<CloseCampaignUseCase>(
			TYPES.CloseCampaignUseCase,
		)
		await useCase.execute(job.data)
	},
}
