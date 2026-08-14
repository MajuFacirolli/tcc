import type { JobDefinition } from "./JobDefinition"
import { campaignEmailJobDefinition } from "./jobs/campaignEmailJob"
import { closeCampaignJobDefinition } from "./jobs/closeCampaignJob"

export const jobDefinitions: Array<JobDefinition<unknown>> = [
	campaignEmailJobDefinition,
	closeCampaignJobDefinition,
]
