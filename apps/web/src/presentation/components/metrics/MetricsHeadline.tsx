import { Clock, Repeat2, TrendingUp, UserCheck } from "lucide-react"
import type { LucideProps } from "lucide-react"
import type { IMetricsVM } from "@/domain/viewmodels/MetricsVM"
import { Card } from "@/presentation/components/ui/Card"
import {
	formatInteger,
	formatPercent,
	formatResponseTime,
} from "@/presentation/utils/formatMetrics"

interface IStatTileProps {
	Icon: React.ForwardRefExoticComponent<LucideProps>
	label: string
	value: string
	/** The denominator the value came from — what makes it actionable, not decoration. */
	basis: string
}

const StatTile = ({ Icon, label, value, basis }: IStatTileProps) => (
	<Card className="gap-3 p-4">
		<div className="flex items-start justify-between gap-3">
			<Card.Description className="text-zinc-900">{label}</Card.Description>
			<Card.Icon Icon={Icon} color="accent" />
		</div>

		<div className="flex flex-col gap-1">
			<p className="text-3xl font-bold tabular-nums text-zinc-900">{value}</p>
			<p className="text-xs text-zinc-500 tabular-nums">{basis}</p>
		</div>
	</Card>
)

interface IMetricsHeadlineProps {
	metrics: IMetricsVM
}

export const MetricsHeadline = ({ metrics }: IMetricsHeadlineProps) => {
	const { headline, reach, retention } = metrics

	return (
		<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			<StatTile
				Icon={TrendingUp}
				label="Taxa de resposta"
				value={formatPercent(headline.responseRate)}
				basis={`${formatInteger(headline.intentions)} de ${formatInteger(reach.notifications)} envios`}
			/>
			<StatTile
				Icon={Clock}
				label="Tempo médio de resposta"
				value={formatResponseTime(headline.averageResponseTime)}
				basis={`média de ${formatInteger(headline.intentions)} respostas`}
			/>
			<StatTile
				Icon={UserCheck}
				label="Intenções registradas"
				value={formatInteger(headline.intentions)}
				basis={`${formatInteger(reach.respondingDonors)} doadores distintos`}
			/>
			<StatTile
				Icon={Repeat2}
				label="Taxa de retenção"
				value={formatPercent(headline.retentionRate)}
				basis={`de ${formatInteger(retention.answeredThenNotified)} reconvites a quem já respondeu`}
			/>
		</div>
	)
}
