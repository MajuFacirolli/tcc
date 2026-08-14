export const EMAIL_TEMPLATE_NAMES = {
	CAMPAIGN_INVITATION: "campaign-invitation",
} as const

export type EmailTemplateName =
	(typeof EMAIL_TEMPLATE_NAMES)[keyof typeof EMAIL_TEMPLATE_NAMES]
