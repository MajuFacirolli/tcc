export const JOB_NAMES = {
	SEND_CAMPAIGN_EMAIL: "send-campaign-email",
	CLOSE_CAMPAIGN: "close-campaign",
	SIMULATE_DONATION_INTENTION: "simulate-donation-intention",
} as const

export type JobName = (typeof JOB_NAMES)[keyof typeof JOB_NAMES]
