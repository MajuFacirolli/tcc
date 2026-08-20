import {
	Clock,
	Mails,
	TrendingDown,
	TrendingUp,
	UserCheck,
	Users,
} from "lucide-react"
import type { LucideProps } from "lucide-react"
import { Line, LineChart, ResponsiveContainer } from "recharts"
import type { IMetricsVM } from "@/domain/viewmodels/MetricsVM"
import { Badge } from "@/presentation/components/ui/Badge"
import { Card } from "@/presentation/components/ui/Card"
import {
	formatInteger,
	formatPercent,
	formatResponseTime,
} from "@/presentation/utils/formatMetrics"

interface ISparklineProps {
	data: (number | null)[]
}

const Sparkline = ({ data }: ISparklineProps) => (
	<div className="h-8 w-20 shrink-0" aria-hidden="true">
		<ResponsiveContainer width="100%" height="100%">
			<LineChart data={data.map((value) => ({ value }))}>
				<Line
					type="monotone"
					dataKey="value"
					stroke="var(--chart-primary)"
					strokeWidth={2}
					dot={false}
					connectNulls
					isAnimationActive={false}
				/>
			</LineChart>
		</ResponsiveContainer>
	</div>
)

interface IStatTileProps {
	Icon: React.ForwardRefExoticComponent<LucideProps>
	label: string
	value: string
	delta?: number
	trend?: (number | null)[]
	/** Whether a rising value is a good thing (false for response time). */
	higherIsBetter?: boolean
}

const StatTile = ({
	Icon,
	label,
	value,
	delta,
	trend,
	higherIsBetter = true,
}: IStatTileProps) => {
	const isImprovement =
		delta === undefined ? true : higherIsBetter ? delta >= 0 : delta < 0
	const DeltaIcon = delta !== undefined && delta < 0 ? TrendingDown : TrendingUp

	return (
		<Card className="gap-3 p-4">
			<div className="flex items-center justify-between gap-4">
				<Card.Icon Icon={Icon} size="lg" color="accent" />
				{trend ? <Sparkline data={trend} /> : null}
			</div>

			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2 flex-wrap">
					<Card.Title className="text-2xl font-bold">{value}</Card.Title>
					{delta !== undefined && delta !== 0 ? (
						<Badge variant={isImprovement ? "success" : "destructive"}>
							<DeltaIcon data-icon="inline-start" />
							{`${delta > 0 ? "+" : ""}${formatPercent(delta)}`}
						</Badge>
					) : null}
				</div>
				<Card.Description className="text-zinc-900">{label}</Card.Description>
			</div>
		</Card>
	)
}

interface IMetricsSummaryProps {
	metrics: IMetricsVM
}

export const MetricsSummary = ({ metrics }: IMetricsSummaryProps) => {
	const { summary, series } = metrics

	const notifiedTrend = series.map((bucket) => bucket.notifiedCount)
	const confirmationsTrend = series.map((bucket) => bucket.confirmationsCount)
	const responseTimeTrend = series.map((bucket) => bucket.averageResponseTime)

	return (
		<section className="flex flex-col gap-6">
			<h3 className="typography-overline">Indicadores do período</h3>

			<div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
				<StatTile
					Icon={Users}
					label="Doadores elegíveis (agora)"
					value={formatInteger(summary.eligibleDonorsPool)}
				/>
				<StatTile
					Icon={Mails}
					label="Doadores notificados"
					value={formatInteger(summary.notifiedCount)}
					delta={summary.deltas.notifiedCount}
					trend={notifiedTrend}
				/>
				<StatTile
					Icon={UserCheck}
					label="Confirmações de intenção"
					value={formatInteger(summary.confirmationsCount)}
					delta={summary.deltas.confirmationsCount}
					trend={confirmationsTrend}
				/>
				<StatTile
					Icon={Clock}
					label="Tempo médio de resposta"
					value={formatResponseTime(summary.averageResponseTime)}
					delta={summary.deltas.averageResponseTime}
					trend={responseTimeTrend}
					higherIsBetter={false}
				/>
			</div>
		</section>
	)
}
