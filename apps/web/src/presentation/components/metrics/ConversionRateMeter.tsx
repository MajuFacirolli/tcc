import type { IMetricsVM } from "@/domain/viewmodels/MetricsVM"
import { Card } from "@/presentation/components/ui/Card"
import {
	formatInteger,
	formatPercent,
} from "@/presentation/utils/formatMetrics"

const RADIUS = 68
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface IConversionRateMeterProps {
	metrics: IMetricsVM
	className?: string
}

export const ConversionRateMeter = ({
	metrics,
	className,
}: IConversionRateMeterProps) => {
	const { summary } = metrics

	const percent = Math.min(Math.max(summary.conversionRate, 0), 100)

	const readout = [
		{ label: "Notificados", value: summary.notifiedCount },
		{ label: "Confirmações", value: summary.confirmationsCount },
	]

	return (
		<Card className={className}>
			<div className="flex flex-col gap-1">
				<Card.Title>Taxa de conversão</Card.Title>
				<Card.Description>Confirmações sobre notificações.</Card.Description>
			</div>

			<div className="flex flex-1 items-center justify-center py-2">
				<div className="relative">
					<svg
						viewBox="0 0 160 160"
						className="size-40 -rotate-90"
						role="img"
						aria-label={`Taxa de conversão de ${formatPercent(percent)}`}
					>
						<circle
							cx="80"
							cy="80"
							r={RADIUS}
							fill="none"
							stroke="var(--chart-track)"
							strokeWidth={14}
						/>
						<circle
							cx="80"
							cy="80"
							r={RADIUS}
							fill="none"
							stroke="var(--chart-primary)"
							strokeWidth={14}
							strokeLinecap="round"
							strokeDasharray={CIRCUMFERENCE}
							strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
						/>
					</svg>

					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<span className="text-4xl font-bold text-zinc-900">
							{formatPercent(percent)}
						</span>
						<span className="text-xs text-zinc-500">converteram</span>
					</div>
				</div>
			</div>

			<dl className="flex flex-col gap-2 border-t border-zinc-200 pt-4">
				{readout.map((item) => (
					<div key={item.label} className="flex items-center justify-between">
						<dt className="text-sm text-zinc-500">{item.label}</dt>
						<dd className="text-sm font-semibold tabular-nums text-zinc-900">
							{formatInteger(item.value)}
						</dd>
					</div>
				))}
			</dl>
		</Card>
	)
}
