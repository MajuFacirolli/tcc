import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts"
import type { IMetricsVM } from "@/domain/viewmodels/MetricsVM"
import { Card } from "@/presentation/components/ui/Card"
import {
	formatBucketLabel,
	formatInteger,
} from "@/presentation/utils/formatMetrics"
import { ChartDataTable } from "../ui/ChartDataTable"
import { ChartTooltip } from "../ui/ChartTooltip"

interface IIntentionsOverTimeChartProps {
	metrics: IMetricsVM
	className?: string
}

/**
 * Intentions on the day the notification went out, not the day the answer arrived, so
 * a spike names the send that caused it. Notification volume is deliberately left off
 * — it runs an order of magnitude higher and would need a second scale to share this
 * axis; the campaign table carries it instead.
 */
export const IntentionsOverTimeChart = ({
	metrics,
	className,
}: IIntentionsOverTimeChartProps) => {
	const data = metrics.series.map((bucket) => ({
		label: formatBucketLabel(bucket.bucketStart),
		value: bucket.intentions,
	}))

	return (
		<Card className={className}>
			<div className="flex flex-col gap-1">
				<Card.Title>Intenções por dia</Card.Title>
				<Card.Description>
					Atribuídas ao dia do envio que as gerou.
				</Card.Description>
			</div>

			<div className="relative h-72 w-full min-w-0">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={data}
						margin={{ top: 12, right: 20, bottom: 0, left: 8 }}
					>
						<defs>
							<linearGradient id="intentionsFill" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="0%"
									stopColor="var(--chart-primary)"
									stopOpacity={0.18}
								/>
								<stop
									offset="100%"
									stopColor="var(--chart-primary)"
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>

						<CartesianGrid
							vertical={false}
							stroke="var(--chart-grid)"
							strokeDasharray="0"
						/>
						<XAxis
							dataKey="label"
							tickLine={false}
							axisLine={false}
							/* 30 daily ticks collide; show every third and let the tooltip carry the rest. */
							interval={2}
							tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							width={40}
							allowDecimals={false}
							tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
							tickFormatter={formatInteger}
						/>
						<Tooltip
							cursor={{ stroke: "var(--chart-axis)", strokeWidth: 1 }}
							content={<ChartTooltip unit="intenções" />}
						/>
						<Area
							type="monotone"
							dataKey="value"
							stroke="var(--chart-primary)"
							strokeWidth={2}
							fill="url(#intentionsFill)"
							dot={false}
							isAnimationActive={false}
							activeDot={{
								r: 5,
								fill: "var(--chart-primary)",
								stroke: "var(--color-white)",
								strokeWidth: 2,
							}}
						/>
					</AreaChart>
				</ResponsiveContainer>

				<ChartDataTable
					caption="Intenções por dia de envio"
					columns={["Dia", "Intenções"]}
					rows={data.map((point) => ({
						label: point.label,
						value: formatInteger(point.value),
					}))}
				/>
			</div>
		</Card>
	)
}
