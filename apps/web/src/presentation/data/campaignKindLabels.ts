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

/**
 * The control arm reads muted and the system's own approach carries the hue, so the
 * comparison states which side is the claim before any number is read.
 *
 * Both arms are named beside every mark they colour — legend, direct label, row or
 * column header — so identity never rests on the colour alone. That is what lets the
 * baseline sit below the chroma floor a categorical hue would have to clear.
 */
export const CAMPAIGN_KIND_CHART_COLORS: Record<CampaignKindEnum, string> = {
	[CampaignKindEnum.GENERIC]: "var(--chart-baseline)",
	[CampaignKindEnum.SEGMENTED]: "var(--chart-primary)",
}
