import type { EmailTemplateName } from "@/application/emails/emailTemplateNames"

export interface IEmailTemplateRenderer {
	render<TProps>(
		templateName: EmailTemplateName,
		props: TProps,
	): Promise<{ html: string; text: string }>
}
