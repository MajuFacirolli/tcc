import { Repeat2 } from "lucide-react"
import type { IMetricsVM } from "@/domain/viewmodels/MetricsVM"
import { Card } from "@/presentation/components/ui/Card"
import {
	formatInteger,
	formatPercent,
	formatPoints,
} from "@/presentation/utils/formatMetrics"

/**
 * What answering once is worth. Two rates on the same scale but never the same
 * denominator: donors who had answered before, and donors who had ignored. The gap
 * between them is what says whether past responders are worth targeting first.
 */

interface IRateBarProps {
	label: string
	basis: string
	rate: number
	/** Shared with the other bar, so the two are directly comparable. */
	scale: number
	color: string
}

const RateBar = ({ label, basis, rate, scale, color }: IRateBarProps) => (
	<div className="flex flex-col gap-1.5">
		<div className="flex items-baseline justify-between gap-2">
			<dt className="text-sm text-zinc-600">{label}</dt>
			<dd className="text-lg font-bold tabular-nums text-zinc-900">
				{formatPercent(rate)}
			</dd>
		</div>
		<div
			aria-hidden="true"
			className="h-2 w-full overflow-hidden rounded-full bg-zinc-100"
		>
			<div
				className="h-full rounded-full"
				style={{
					width: `${scale === 0 ? 0 : (rate / scale) * 100}%`,
					backgroundColor: color,
				}}
			/>
		</div>
		<p className="text-xs text-zinc-500 tabular-nums">{basis}</p>
	</div>
)

interface IRetentionPanelProps {
	metrics: IMetricsVM
	className?: string
}

export const RetentionPanel = ({
	metrics,
	className,
}: IRetentionPanelProps) => {
	const { retention, reach } = metrics
	const scale = Math.max(retention.rate, retention.reactivationRate, 1)
	const lift = retention.rate - retention.reactivationRate

	return (
		<Card className={className}>
			<div className="flex items-start justify-between gap-3">
				<div className="flex flex-col gap-1">
					<Card.Title>Retenção de resposta</Card.Title>
					<Card.Description>
						Quem já respondeu responde de novo?
					</Card.Description>
				</div>
				<Card.Icon Icon={Repeat2} size="lg" color="accent" />
			</div>

			<dl className="flex flex-col gap-4">
				<RateBar
					label="Já havia respondido"
					basis={`${formatInteger(retention.answeredThenNotified)} reconvites`}
					rate={retention.rate}
					scale={scale}
					color="var(--chart-primary)"
				/>
				<RateBar
					label="Havia ignorado"
					basis={`${formatInteger(retention.ignoredThenNotified)} reconvites`}
					rate={retention.reactivationRate}
					scale={scale}
					color="var(--chart-ordinal-1)"
				/>
			</dl>

			<dl className="flex flex-col gap-2 border-t border-zinc-200 pt-3 text-sm">
				<div className="flex items-center justify-between gap-3">
					<dt className="text-zinc-500">Diferença</dt>
					<dd className="font-semibold tabular-nums text-zinc-900">
						{formatPoints(lift)}
					</dd>
				</div>
				<div className="flex items-center justify-between gap-3">
					<dt className="text-zinc-500">Responderam mais de uma vez</dt>
					<dd className="font-semibold tabular-nums text-zinc-900">
						{formatInteger(reach.repeatResponders)}
					</dd>
				</div>
				<div className="flex items-center justify-between gap-3">
					<dt className="text-zinc-500">Base alcançada</dt>
					<dd className="font-semibold tabular-nums text-zinc-900">
						{formatInteger(reach.respondingDonors)} de{" "}
						{formatInteger(reach.donorsReached)}
					</dd>
				</div>
			</dl>
		</Card>
	)
}
