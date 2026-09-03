import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts"
import type { TooltipContentProps } from "recharts"
import { CampaignKindEnum } from "@/domain/enums/CampaignKindEnum"
import type { IMetricsVM } from "@/domain/viewmodels/MetricsVM"
import { Card } from "@/presentation/components/ui/Card"
import {
	CAMPAIGN_KIND_CHART_COLORS,
	CAMPAIGN_KIND_LABELS,
} from "@/presentation/data/campaignKindLabels"
import { formatPercent } from "@/presentation/utils/formatMetrics"
import { ChartDataTable } from "../ui/ChartDataTable"

/** Baseline first, so the improvement reads left to right. */
const ARMS = [CampaignKindEnum.GENERIC, CampaignKindEnum.SEGMENTED] as const

/**
 * The two rate-shaped metrics of the study. Both are percentages of the same
 * denominator — messages sent — so they share one axis and one polarity: higher is
 * better in each. Counts and durations are left to the table, which has no axis to
 * conflict over.
 */
const MEASURES = [
	{ key: "conversionRate" as const, label: "Taxa de resposta" },
	{
		key: "targetingPrecision" as const,
		label: "Precisão do direcionamento",
	},
]

type ComparisonDatum = {
	label: string
	[CampaignKindEnum.GENERIC]: number
	[CampaignKindEnum.SEGMENTED]: number
}

const ComparisonTooltip = ({
	active,
	payload,
}: Partial<
	Pick<TooltipContentProps<number, string>, "active" | "payload">
>) => {
	if (!active || !payload?.length) return null

	return (
		<div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-sm">
			<p className="typography-overline">{payload[0]?.payload.label}</p>
			<div className="mt-1 flex flex-col gap-0.5">
				{payload.map((entry) => (
					<p
						key={String(entry.dataKey)}
						className="flex items-center gap-2 text-sm"
					>
						<span
							aria-hidden="true"
							className="size-2.5 shrink-0 rounded-sm"
							style={{ backgroundColor: entry.color }}
						/>
						<span className="text-zinc-500">
							{CAMPAIGN_KIND_LABELS[entry.dataKey as CampaignKindEnum]}
						</span>
						<span className="ml-auto font-semibold tabular-nums text-zinc-900">
							{formatPercent(Number(entry.value))}
						</span>
					</p>
				))}
			</div>
		</div>
	)
}

interface ISegmentationComparisonChartProps {
	metrics: IMetricsVM
	className?: string
}

/**
 * Two measures rather than one: the response rate is the outcome the strategies are
 * judged on, and targeting precision is the mechanism it is attributed to — a
 * segmented campaign wins the first because it wins the second.
 */
export const SegmentationComparisonChart = ({
	metrics,
	className,
}: ISegmentationComparisonChartProps) => {
	const { comparison } = metrics

	const data: ComparisonDatum[] = MEASURES.map((measure) => ({
		label: measure.label,
		[CampaignKindEnum.GENERIC]: comparison.generic[measure.key],
		[CampaignKindEnum.SEGMENTED]: comparison.segmented[measure.key],
	}))

	return (
		<Card className={className}>
			<div className="flex flex-col gap-1">
				<Card.Title>Resposta e direcionamento</Card.Title>
				<Card.Description>
					Ambas as taxas usam o mesmo denominador: e-mails enviados.
				</Card.Description>
			</div>

			<ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
				{ARMS.map((kind) => (
					<li key={kind} className="flex items-center gap-2">
						<span
							aria-hidden="true"
							className="size-2.5 shrink-0 rounded-sm"
							style={{ backgroundColor: CAMPAIGN_KIND_CHART_COLORS[kind] }}
						/>
						<span className="text-sm text-zinc-600">
							{CAMPAIGN_KIND_LABELS[kind]}
						</span>
					</li>
				))}
			</ul>

			<div className="relative h-64 w-full min-w-0">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={data}
						barGap={2}
						margin={{ top: 24, right: 8, bottom: 0, left: 8 }}
					>
						<CartesianGrid
							vertical={false}
							stroke="var(--chart-grid)"
							strokeDasharray="0"
						/>
						<XAxis
							dataKey="label"
							tickLine={false}
							axisLine={false}
							tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							width={48}
							domain={[0, 100]}
							tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
							tickFormatter={(value) => formatPercent(Number(value), 0)}
						/>
						<Tooltip
							cursor={{ fill: "var(--color-zinc-100)" }}
							content={<ComparisonTooltip />}
						/>
						{ARMS.map((kind) => (
							<Bar
								key={kind}
								dataKey={kind}
								name={CAMPAIGN_KIND_LABELS[kind]}
								fill={CAMPAIGN_KIND_CHART_COLORS[kind]}
								radius={[4, 4, 0, 0]}
								maxBarSize={56}
								isAnimationActive={false}
							>
								<LabelList
									dataKey={kind}
									position="top"
									offset={8}
									fill="var(--color-zinc-900)"
									fontSize={12}
									fontWeight={600}
									formatter={(value) => formatPercent(Number(value))}
								/>
							</Bar>
						))}
					</BarChart>
				</ResponsiveContainer>

				<ChartDataTable
					caption="Taxa de resposta e precisão do direcionamento por estratégia"
					columns={["Medida", "Taxa"]}
					rows={data.flatMap((datum) =>
						ARMS.map((kind) => ({
							label: `${datum.label} — ${CAMPAIGN_KIND_LABELS[kind]}`,
							value: formatPercent(datum[kind]),
						})),
					)}
				/>
			</div>
		</Card>
	)
}
