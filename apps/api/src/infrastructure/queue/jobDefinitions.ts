import type { JobDefinition } from "./JobDefinition"
import { campaignEmailJobDefinition } from "./jobs/campaignEmailJob"

export const jobDefinitions: Array<JobDefinition<unknown>> = [
	campaignEmailJobDefinition,
]
