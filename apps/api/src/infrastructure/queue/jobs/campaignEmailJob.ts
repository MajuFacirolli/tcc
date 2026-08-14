import { container } from "@/container/Ioc.config"
import { TYPES } from "@/container/types"
import type { SendCampaignEmailUseCase } from "@application/use_cases/campaigns/SendCampaignEmail"
import { QUEUE_NAMES } from "@/application/queues/queueNames"
import type { JobDefinition } from "../JobDefinition"
import type { SendCampaignEmailInput } from "@/application/dtos/campaigns/SendCampaignEmailInput"

export const campaignEmailJobDefinition: JobDefinition<SendCampaignEmailInput> =
	{
		queueName: QUEUE_NAMES.CAMPAIGN_EMAIL,
		concurrency: 5,
		async process(job) {
			const useCase = container.get<SendCampaignEmailUseCase>(
				TYPES.SendCampaignEmailUseCase,
			)
			await useCase.execute(job.data)
		},
	}
