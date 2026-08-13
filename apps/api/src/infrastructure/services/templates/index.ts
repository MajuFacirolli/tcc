import type { EmailTemplateName } from "@/application/emails/emailTemplateNames"
import type { ReactElement } from "react"

export const templates: Record<
	EmailTemplateName,
	(props: any) => ReactElement
> = {}
