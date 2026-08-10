import { CampaignStatusEnum } from "@/domain/enums/CampaignStatusEnum"

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatusEnum, string> = {
	[CampaignStatusEnum.ACTIVE]: "Ativa",
	[CampaignStatusEnum.CLOSED]: "Finalizada",
	[CampaignStatusEnum.DRAFT]: "Rascunho",
}
