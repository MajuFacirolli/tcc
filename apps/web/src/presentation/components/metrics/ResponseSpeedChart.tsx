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
import type { IMetricsVM } from "@/domain/viewmodels/MetricsVM"
import { Card } from "@/presentation/components/ui/Card"
import {
	formatHours,
	formatInteger,
	formatPercent,
} from "@/presentation/utils/formatMetrics"
import { ChartDataTable } from "../ui/ChartDataTable"
import { ChartTooltip } from "../ui/ChartTooltip"

interface IResponseSpeedChartProps {
	metrics: IMetricsVM
	className?: string
}

/**
 * Cumulative, not per-bucket: each bar is "answered within this long", which is the
 * form the question takes when deciding how long to hold a slot open.
 */
export const ResponseSpeedChart = ({
	metrics,
	className,
}: IResponseSpeedChartProps) => {
	const data = metrics.responseSpeed.map((point) => ({
		label: `até ${formatHours(point.hours)}`,
		value: point.share,
		intentions: point.intentions,
	}))

	return (
		<Card className={className}>
			<div className="flex flex-col gap-1">
				<Card.Title>Velocidade de resposta</Card.Title>
				<Card.Description>Intenções acumuladas desde o envio.</Card.Description>
			</div>

			<div className="relative h-64 w-full min-w-0">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={data}
						layout="vertical"
						margin={{ top: 4, right: 52, bottom: 0, left: 0 }}
					>
						<CartesianGrid
							horizontal={false}
							stroke="var(--chart-grid)"
							strokeDasharray="0"
						/>
						<XAxis
							type="number"
							domain={[0, 100]}
							tickLine={false}
							axisLine={false}
							tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
							tickFormatter={(value) => formatPercent(Number(value), 0)}
						/>
						<YAxis
							type="category"
							dataKey="label"
							tickLine={false}
							axisLine={false}
							width={64}
							tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
						/>
						<Tooltip
							cursor={{ fill: "var(--color-zinc-100)" }}
							content={
								<ChartTooltip
									formatValue={(value) => formatPercent(value)}
									unit="das intenções"
								/>
							}
						/>
						<Bar
							dataKey="value"
							fill="var(--chart-primary)"
							radius={[0, 4, 4, 0]}
							maxBarSize={22}
							isAnimationActive={false}
						>
							<LabelList
								dataKey="value"
								position="right"
								offset={8}
								fill="var(--color-zinc-900)"
								fontSize={12}
								fontWeight={600}
								formatter={(value) => formatPercent(Number(value))}
							/>
						</Bar>
					</BarChart>
				</ResponsiveContainer>

				<ChartDataTable
					caption="Intenções acumuladas por tempo desde o envio"
					columns={["Prazo", "Intenções"]}
					rows={data.map((point) => ({
						label: point.label,
						value: `${formatInteger(point.intentions)} (${formatPercent(point.value)})`,
					}))}
				/>
			</div>
		</Card>
	)
}
