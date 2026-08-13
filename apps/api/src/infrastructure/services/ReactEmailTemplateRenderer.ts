import { render } from "@react-email/render"
import type { IEmailTemplateRenderer } from "@application/interfaces/IEmailTemplateRenderer"
import type { EmailTemplateName } from "@application/emails/emailTemplateNames"
import { templates } from "./templates"

export class ReactEmailTemplateRenderer implements IEmailTemplateRenderer {
	async render<TProps>(
		templateName: EmailTemplateName,
		props: TProps,
	): Promise<{ html: string; text: string }> {
		const element = templates[templateName](props)

		const [html, text] = await Promise.all([
			render(element),
			render(element, { plainText: true }),
		])

		return { html, text }
	}
}
