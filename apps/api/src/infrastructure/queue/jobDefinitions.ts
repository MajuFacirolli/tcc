import type { JobDefinition } from "./JobDefinition"
import { campaignEmailJobDefinition } from "./jobs/campaignEmailJob"
import { closeCampaignJobDefinition } from "./jobs/closeCampaignJob"
import { donationIntentionJobDefinition } from "./jobs/donationIntentionJob"

export const jobDefinitions: Array<JobDefinition<unknown>> = [
	campaignEmailJobDefinition,
	closeCampaignJobDefinition,
	donationIntentionJobDefinition,
]
