import { Clock, Target, TrendingUp, Users } from "lucide-react"
import type { LucideProps } from "lucide-react"
import { CampaignKindEnum } from "@/domain/enums/CampaignKindEnum"
import type {
	IMetricsKindSummaryVM,
	IMetricsVM,
} from "@/domain/viewmodels/MetricsVM"
import { Badge } from "@/presentation/components/ui/Badge"
import { Card } from "@/presentation/components/ui/Card"
import {
	CAMPAIGN_KIND_CHART_COLORS,
	CAMPAIGN_KIND_LABELS,
} from "@/presentation/data/campaignKindLabels"
import {
	formatInteger,
	formatPercent,
	formatPoints,
	formatResponseTime,
} from "@/presentation/utils/formatMetrics"

/** Baseline first, so the comparison reads left to right, top to bottom. */
const ARMS = [CampaignKindEnum.GENERIC, CampaignKindEnum.SEGMENTED] as const

type Measure = {
	key: string
	label: string
	/** A formula, not a sentence — the card has no room for prose. */
	hint: string
	Icon: React.ForwardRefExoticComponent<LucideProps>
	pick: (arm: IMetricsKindSummaryVM) => number
	format: (value: number) => string
	/** Whether a larger value is the better outcome — false for response time. */
	higherIsBetter: boolean
	/** How the gap between the arms is stated. */
	gap: "points" | "ratio" | "duration"
}

/**
 * The four metrics the comparison is built on. Each is shown per arm rather than
 * pooled, because the question the page answers is a difference between arms, not a
 * total.
 */
const MEASURES: Measure[] = [
	{
		key: "conversionRate",
		label: "Taxa de resposta",
		hint: "confirmações ÷ e-mails enviados",
		Icon: TrendingUp,
		pick: (arm) => arm.conversionRate,
		format: (value) => formatPercent(value),
		higherIsBetter: true,
		gap: "points",
	},
	{
		key: "averageResponseTime",
		label: "Tempo médio de resposta",
		hint: "do disparo à confirmação",
		Icon: Clock,
		pick: (arm) => arm.averageResponseTime,
		format: formatResponseTime,
		higherIsBetter: false,
		gap: "duration",
	},
	{
		key: "eligibleReached",
		label: "Envios a doadores elegíveis",
		hint: "e-mails que chegaram a quem podia doar",
		Icon: Users,
		pick: (arm) => arm.eligibleReached,
		format: formatInteger,
		higherIsBetter: true,
		gap: "ratio",
	},
	{
		key: "targetingPrecision",
		label: "Precisão do direcionamento",
		hint: "aptos e no público-alvo ÷ e-mails enviados",
		Icon: Target,
		pick: (arm) => arm.targetingPrecision,
		format: (value) => formatPercent(value),
		higherIsBetter: true,
		gap: "points",
	},
]

function describeGap(measure: Measure, generic: number, segmented: number) {
	if (measure.gap === "points") return formatPoints(segmented - generic)

	if (measure.gap === "duration") {
		const difference = Math.abs(segmented - generic)
		if (difference === 0) return null
		return `${segmented < generic ? "−" : "+"}${formatResponseTime(difference)}`
	}

	// A count comparison only means something as a share of the larger side.
	if (generic === 0) return null
	return formatPercent(((segmented - generic) / generic) * 100)
}

interface IMeasureCardProps {
	measure: Measure
	byKind: Record<CampaignKindEnum, IMetricsKindSummaryVM>
}

const MeasureCard = ({ measure, byKind }: IMeasureCardProps) => {
	const generic = measure.pick(byKind[CampaignKindEnum.GENERIC])
	const segmented = measure.pick(byKind[CampaignKindEnum.SEGMENTED])

	// Bars are scaled against the larger arm so the two are directly comparable.
	const largest = Math.max(generic, segmented)
	const gap = describeGap(measure, generic, segmented)

	const isImprovement = measure.higherIsBetter
		? segmented > generic
		: segmented < generic
	const isTied = segmented === generic

	return (
		<Card className="gap-4">
			<div className="flex items-start justify-between gap-3">
				<div className="flex flex-col gap-1">
					<Card.Title className="text-sm">{measure.label}</Card.Title>
					<Card.Description className="text-xs">
						{measure.hint}
					</Card.Description>
				</div>
				<Card.Icon Icon={measure.Icon} color="accent" />
			</div>

			<dl className="flex flex-col gap-3">
				{ARMS.map((kind) => {
					const value = measure.pick(byKind[kind])
					const width = largest === 0 ? 0 : (value / largest) * 100

					return (
						<div key={kind} className="flex flex-col gap-1.5">
							<div className="flex items-baseline justify-between gap-2">
								<dt className="flex items-center gap-2 text-xs text-zinc-500">
									<span
										aria-hidden="true"
										className="size-2.5 shrink-0 rounded-sm"
										style={{
											backgroundColor: CAMPAIGN_KIND_CHART_COLORS[kind],
										}}
									/>
									{CAMPAIGN_KIND_LABELS[kind]}
								</dt>
								<dd className="text-lg font-bold tabular-nums text-zinc-900">
									{measure.format(value)}
								</dd>
							</div>
							{/* Decorative: the value beside it already carries the number. */}
							<div
								aria-hidden="true"
								className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100"
							>
								<div
									className="h-full rounded-full"
									style={{
										width: `${width}%`,
										backgroundColor: CAMPAIGN_KIND_CHART_COLORS[kind],
									}}
								/>
							</div>
						</div>
					)
				})}
			</dl>

			{gap && !isTied && (
				<div className="flex items-center justify-between gap-2 border-t border-zinc-200 pt-3">
					<span className="text-xs text-zinc-500">Diferença</span>
					<Badge variant={isImprovement ? "success" : "destructive"}>
						{gap}
					</Badge>
				</div>
			)}
		</Card>
	)
}

interface ICoreMetricsComparisonProps {
	metrics: IMetricsVM
}

export const CoreMetricsComparison = ({
	metrics,
}: ICoreMetricsComparisonProps) => {
	const byKind: Record<CampaignKindEnum, IMetricsKindSummaryVM> = {
		[CampaignKindEnum.GENERIC]: metrics.comparison.generic,
		[CampaignKindEnum.SEGMENTED]: metrics.comparison.segmented,
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{MEASURES.map((measure) => (
				<MeasureCard key={measure.key} measure={measure} byKind={byKind} />
			))}
		</div>
	)
}
