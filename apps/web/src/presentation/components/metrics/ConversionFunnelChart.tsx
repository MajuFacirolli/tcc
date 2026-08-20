import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	LabelList,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts"
import type { IMetricsVM } from "@/domain/viewmodels/MetricsVM"
import { Card } from "@/presentation/components/ui/Card"
import {
	formatInteger,
	formatPercent,
} from "@/presentation/utils/formatMetrics"
import { ChartDataTable } from "../ui/ChartDataTable"
import { ChartTooltip } from "../ui/ChartTooltip"

const STAGE_COLORS = [
	"var(--chart-ordinal-2)",
	"var(--chart-ordinal-3)",
	"var(--chart-ordinal-4)",
]

interface IConversionFunnelChartProps {
	metrics: IMetricsVM
	className?: string
}

export const ConversionFunnelChart = ({
	metrics,
	className,
}: IConversionFunnelChartProps) => {
	const { funnel } = metrics

	const stages = [
		{ label: "Elegíveis alcançados", value: funnel.eligibleReached },
		{ label: "Notificados", value: funnel.notified },
		{ label: "Confirmações", value: funnel.confirmed },
	]

	return (
		<Card className={className}>
			<div className="flex flex-col gap-1">
				<Card.Title>Funil de conversão</Card.Title>
				<Card.Description>
					Da elegibilidade à confirmação de intenção.
				</Card.Description>
			</div>

			<div className="relative h-72 w-full min-w-0">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={stages}
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
							width={44}
							tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
							tickFormatter={formatInteger}
						/>
						<Tooltip
							cursor={{ fill: "var(--color-zinc-100)" }}
							content={<ChartTooltip unit="doadores" />}
						/>
						<Bar
							dataKey="value"
							radius={[4, 4, 0, 0]}
							maxBarSize={64}
							isAnimationActive={false}
						>
							{stages.map((stage, index) => (
								<Cell key={stage.label} fill={STAGE_COLORS[index]} />
							))}
							<LabelList
								dataKey="value"
								position="top"
								offset={10}
								fill="var(--color-zinc-900)"
								fontSize={12}
								fontWeight={600}
								formatter={(value) => formatInteger(Number(value))}
							/>
						</Bar>
					</BarChart>
				</ResponsiveContainer>

				<ChartDataTable
					caption="Funil de conversão por etapa"
					columns={["Etapa", "Doadores"]}
					rows={stages.map((stage) => ({
						label: stage.label,
						value: formatInteger(stage.value),
					}))}
				/>
			</div>

			<div className="grid grid-cols-2 gap-2 border-t border-zinc-200 pt-4">
				{stages.slice(1).map((stage, index) => {
					const previous = stages[index]
					const retention = previous.value
						? (stage.value / previous.value) * 100
						: 0

					return (
						<div key={stage.label} className="flex flex-col gap-0.5">
							<span className="text-sm font-semibold tabular-nums text-zinc-900">
								{formatPercent(retention)}
							</span>
							<span className="text-xs text-zinc-500">
								{`${previous.label} → ${stage.label}`}
							</span>
						</div>
					)
				})}
			</div>
		</Card>
	)
}
