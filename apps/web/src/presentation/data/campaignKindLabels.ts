import { CampaignKindEnum } from "@/domain/enums/CampaignKindEnum"

export const CAMPAIGN_KIND_LABELS: Record<CampaignKindEnum, string> = {
	[CampaignKindEnum.GENERIC]: "Genérico",
	[CampaignKindEnum.SEGMENTED]: "Segmentado",
}
