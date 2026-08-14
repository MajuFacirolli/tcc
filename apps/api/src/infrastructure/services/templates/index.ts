import {
	EMAIL_TEMPLATE_NAMES,
	type EmailTemplateName,
} from "@/application/emails/emailTemplateNames"
import type { ReactElement } from "react"

import { CampaignInvitationEmail } from "./CampaignInvitationEmail"

export const templates: Record<
	EmailTemplateName,
	(props: any) => ReactElement
> = {
	[EMAIL_TEMPLATE_NAMES.CAMPAIGN_INVITATION]: CampaignInvitationEmail,
}
