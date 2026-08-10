import type { CampaignStatusEnum } from "@/domain/enums/CampaignStatusEnum"

export const CAMPAIGN_STATUS_CONFIG: Record<CampaignStatusEnum, string> = {
	active: "bg-yellow-400",
	closed: "bg-green-500",
	draft: "bg-zinc-400",
}
