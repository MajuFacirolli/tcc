import { CampaignKindEnum } from "@/domain/enums/CampaignKindEnum"

export const CAMPAIGN_KIND_LABELS: Record<CampaignKindEnum, string> = {
	[CampaignKindEnum.GENERIC]: "Genérica",
	[CampaignKindEnum.SEGMENTED]: "Segmentada",
}

export const CAMPAIGN_KIND_DESCRIPTIONS: Record<CampaignKindEnum, string> = {
	[CampaignKindEnum.GENERIC]:
		"Envia para toda a base de doadores, sem filtrar por tipo sanguíneo ou elegibilidade.",
	[CampaignKindEnum.SEGMENTED]:
		"Envia apenas para doadores do tipo sanguíneo solicitado que já cumpriram o intervalo entre doações.",
}

/** Baseline in the pale step, the system's own approach in the emphatic one. */
export const CAMPAIGN_KIND_CHART_COLORS: Record<CampaignKindEnum, string> = {
	[CampaignKindEnum.GENERIC]: "var(--chart-ordinal-1)",
	[CampaignKindEnum.SEGMENTED]: "var(--chart-primary)",
}
