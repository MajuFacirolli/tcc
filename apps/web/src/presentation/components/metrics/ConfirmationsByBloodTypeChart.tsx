import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts"
import { BLOOD_TYPES } from "@/domain/enums/BloodTypeEnum"
import type { IMetricsVM } from "@/domain/viewmodels/MetricsVM"
import { Card } from "@/presentation/components/ui/Card"
import { formatInteger } from "@/presentation/utils/formatMetrics"
import { ChartDataTable } from "../ui/ChartDataTable"
import { ChartTooltip } from "../ui/ChartTooltip"

interface IConfirmationsByBloodTypeChartProps {
	metrics: IMetricsVM
	className?: string
}

export const ConfirmationsByBloodTypeChart = ({
	metrics,
	className,
}: IConfirmationsByBloodTypeChartProps) => {
	const confirmationsByType = new Map(
		metrics.confirmationsByBloodType.map((item) => [
			item.bloodType,
			item.confirmations,
		]),
	)

	const data = BLOOD_TYPES.map((bloodType) => ({
		label: bloodType,
		value: confirmationsByType.get(bloodType) ?? 0,
	})).sort((a, b) => b.value - a.value)

	return (
		<Card className={className}>
			<div className="flex flex-col gap-1">
				<Card.Title>Confirmações por tipo sanguíneo</Card.Title>
				<Card.Description>Onde a mobilização tem mais adesão.</Card.Description>
			</div>

			<div className="relative h-72 w-full min-w-0">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={data}
						layout="vertical"
						margin={{ top: 4, right: 16, bottom: 0, left: 0 }}
					>
						<CartesianGrid
							horizontal={false}
							stroke="var(--chart-grid)"
							strokeDasharray="0"
						/>
						<XAxis
							type="number"
							tickLine={false}
							axisLine={false}
							allowDecimals={false}
							tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
							tickFormatter={formatInteger}
						/>
						<YAxis
							type="category"
							dataKey="label"
							tickLine={false}
							axisLine={false}
							width={40}
							tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
						/>
						<Tooltip
							cursor={{ fill: "var(--color-zinc-100)" }}
							content={<ChartTooltip unit="confirmações" />}
						/>
						<Bar
							dataKey="value"
							fill="var(--chart-primary)"
							radius={[0, 4, 4, 0]}
							maxBarSize={18}
							isAnimationActive={false}
						/>
					</BarChart>
				</ResponsiveContainer>

				<ChartDataTable
					caption="Confirmações por tipo sanguíneo"
					columns={["Tipo sanguíneo", "Confirmações"]}
					rows={data.map((item) => ({
						label: item.label,
						value: formatInteger(item.value),
					}))}
				/>
			</div>
		</Card>
	)
}
