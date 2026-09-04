import type { ComponentProps } from "react"
import type { CampaignStatusEnum } from "@/domain/enums/CampaignStatusEnum"
import type { Badge } from "@/presentation/components/ui/Badge"

export const CAMPAIGN_STATUS_BADGE_VARIANT: Record<
	CampaignStatusEnum,
	ComponentProps<typeof Badge>["variant"]
> = {
	active: "warning",
	closed: "success",
	draft: "ghost",
}
