import { CampaignKindEnum } from "@/domain/enums/CampaignKindEnum"
import type {
	IMetricsKindSummaryVM,
	IMetricsVM,
} from "@/domain/viewmodels/MetricsVM"
import { Card } from "@/presentation/components/ui/Card"
import {
	CAMPAIGN_KIND_CHART_COLORS,
	CAMPAIGN_KIND_LABELS,
} from "@/presentation/data/campaignKindLabels"
import {
	formatInteger,
	formatPercent,
	formatResponseTime,
} from "@/presentation/utils/formatMetrics"

const ARMS = [CampaignKindEnum.GENERIC, CampaignKindEnum.SEGMENTED] as const

type Row = {
	label: string
	hint?: string
	format: (value: number) => string
	pick: (arm: IMetricsKindSummaryVM) => number
	emphasis?: boolean
}

const ROWS: Row[] = [
	{
		label: "Taxa de resposta",
		hint: "confirmações ÷ e-mails enviados",
		format: (value) => formatPercent(value),
		pick: (arm) => arm.conversionRate,
		emphasis: true,
	},
	{
		label: "Tempo médio de resposta",
		format: formatResponseTime,
		pick: (arm) => arm.averageResponseTime,
		emphasis: true,
	},
	{
		label: "Envios a doadores elegíveis",
		format: formatInteger,
		pick: (arm) => arm.eligibleReached,
		emphasis: true,
	},
	{
		label: "Precisão do direcionamento",
		hint: "aptos e no público-alvo ÷ e-mails enviados",
		format: (value) => formatPercent(value),
		pick: (arm) => arm.targetingPrecision,
		emphasis: true,
	},
	{
		label: "Campanhas disparadas",
		format: formatInteger,
		pick: (arm) => arm.campaignsCount,
	},
	{
		label: "E-mails disparados",
		format: formatInteger,
		pick: (arm) => arm.notifiedCount,
	},
	{
		label: "Confirmações de intenção",
		format: formatInteger,
		pick: (arm) => arm.confirmationsCount,
	},
	{
		label: "Conversão entre aptos",
		hint: "confirmações ÷ envios a elegíveis",
		format: (value) => formatPercent(value),
		pick: (arm) => arm.eligibleConversionRate,
	},
]

interface ISegmentationTableProps {
	metrics: IMetricsVM
	className?: string
}

export const SegmentationTable = ({
	metrics,
	className,
}: ISegmentationTableProps) => {
	const byKind: Record<CampaignKindEnum, IMetricsKindSummaryVM> = {
		[CampaignKindEnum.GENERIC]: metrics.comparison.generic,
		[CampaignKindEnum.SEGMENTED]: metrics.comparison.segmented,
	}

	return (
		<Card className={className}>
			<div className="flex flex-col gap-1">
				<Card.Title>Comparação detalhada</Card.Title>
				<Card.Description>
					As quatro métricas em destaque, seguidas dos volumes que as compõem.
				</Card.Description>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full min-w-lg text-sm">
					<thead>
						<tr>
							<th className="w-3/5" />
							{ARMS.map((kind) => (
								<th
									key={kind}
									scope="col"
									className="pb-3 text-right font-medium text-zinc-500"
								>
									<span className="inline-flex items-center gap-2">
										<span
											aria-hidden="true"
											className="size-2.5 shrink-0 rounded-sm"
											style={{
												backgroundColor: CAMPAIGN_KIND_CHART_COLORS[kind],
											}}
										/>
										{CAMPAIGN_KIND_LABELS[kind]}
									</span>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{ROWS.map((row) => (
							<tr key={row.label} className="border-t border-zinc-100">
								<th scope="row" className="py-2.5 text-left font-normal">
									<span className="flex flex-col">
										<span
											className={
												row.emphasis ? "text-zinc-900" : "text-zinc-500"
											}
										>
											{row.label}
										</span>
										{row.hint ? (
											<span className="text-xs text-zinc-400">{row.hint}</span>
										) : null}
									</span>
								</th>
								{ARMS.map((kind) => (
									<td
										key={kind}
										className={`py-2.5 text-right tabular-nums text-zinc-900 ${
											row.emphasis ? "text-base font-bold" : "font-semibold"
										}`}
									>
										{row.format(row.pick(byKind[kind]))}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Card>
	)
}
