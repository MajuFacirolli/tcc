export const EMAIL_TEMPLATE_NAMES = {} as const

export type EmailTemplateName =
	(typeof EMAIL_TEMPLATE_NAMES)[keyof typeof EMAIL_TEMPLATE_NAMES]
