export const JOB_NAMES = {
	SEND_CAMPAIGN_EMAIL: "send-campaign-email",
} as const

export type JobName = (typeof JOB_NAMES)[keyof typeof JOB_NAMES]
