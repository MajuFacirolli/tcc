export const QUEUE_NAMES = {
	CAMPAIGN_EMAIL: "campaign-email",
	CAMPAIGN_LIFECYCLE: "campaign-lifecycle",
} as const

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES]
