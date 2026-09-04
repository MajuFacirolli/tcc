import { FlaskConical, Target, Users } from "lucide-react"
import { CampaignKindEnum } from "@/domain/enums/CampaignKindEnum"
import type { IMetricsVM } from "@/domain/viewmodels/MetricsVM"
import { Card } from "@/presentation/components/ui/Card"
import {
	CAMPAIGN_KIND_CHART_COLORS,
	CAMPAIGN_KIND_LABELS,
} from "@/presentation/data/campaignKindLabels"
import {
	formatInteger,
	formatMultiplier,
	formatPercent,
	formatPoints,
} from "@/presentation/utils/formatMetrics"

interface ISegmentationVerdictProps {
	metrics: IMetricsVM
	className?: string
}

/**
 * The page's answer, stated in words before any chart is read: under the simulation's
 * behavioural premises, this is how the segmented strategy performed against the
 * generic one. The hero number is the response-rate ratio because that is the outcome
 * the strategies are being judged on; targeting precision sits beside it because it is
 * the mechanism the ratio is attributed to.
 */
export const SegmentationVerdict = ({
	metrics,
	className,
}: ISegmentationVerdictProps) => {
	const { generic, segmented, conversionLift, targetingPrecisionGain } =
		metrics.comparison

	const isComparable = conversionLift !== null

	return (
		<Card className={className}>
			<div className="flex items-start justify-between gap-4">
				<div className="flex flex-col gap-1">
					<Card.Title>A segmentação compensa?</Card.Title>
					<Card.Description>Segmentada sobre genérica.</Card.Description>
				</div>
				<Card.Icon Icon={FlaskConical} size="lg" color="accent" />
			</div>

			{!isComparable ? (
				<p className="flex flex-1 items-center justify-center py-6 text-center text-sm text-zinc-500">
					{generic.campaignsCount === 0
						? "Nenhuma campanha genérica no período — sem base de comparação."
						: "Nenhuma campanha segmentada no período — sem base de comparação."}
				</p>
			) : (
				<>
					<div className="flex flex-1 flex-col justify-center gap-3">
						<div className="flex items-baseline gap-2">
							<span className="text-6xl font-bold tracking-tight text-zinc-900">
								{formatMultiplier(conversionLift)}
							</span>
							<span className="text-sm text-zinc-500">
								mais confirmações por mensagem enviada
							</span>
						</div>

						<dl className="flex flex-col gap-2">
							{[
								{ kind: CampaignKindEnum.GENERIC, arm: generic },
								{ kind: CampaignKindEnum.SEGMENTED, arm: segmented },
							].map(({ kind, arm }) => (
								<div
									key={kind}
									className="flex items-center justify-between gap-3"
								>
									<dt className="flex items-center gap-2 text-sm text-zinc-500">
										<span
											aria-hidden="true"
											className="size-2.5 shrink-0 rounded-sm"
											style={{
												backgroundColor: CAMPAIGN_KIND_CHART_COLORS[kind],
											}}
										/>
										{CAMPAIGN_KIND_LABELS[kind]}
									</dt>
									<dd className="text-sm font-semibold tabular-nums text-zinc-900">
										{formatPercent(arm.conversionRate)}
									</dd>
								</div>
							))}
						</dl>
					</div>
				</>
			)}

			<dl className="flex flex-col gap-2 border-t border-zinc-200 pt-4 text-sm">
				<div className="flex items-center justify-between gap-3">
					<dt className="flex items-center gap-2 text-zinc-500">
						<Target className="size-3.5 shrink-0" aria-hidden="true" />
						Ganho de precisão do direcionamento
					</dt>
					<dd className="font-semibold tabular-nums text-zinc-900">
						{targetingPrecisionGain === null
							? "—"
							: formatPoints(targetingPrecisionGain)}
					</dd>
				</div>
				<div className="flex items-center justify-between gap-3">
					<dt className="flex items-center gap-2 text-zinc-500">
						<Users className="size-3.5 shrink-0" aria-hidden="true" />
						Doadores elegíveis na base
					</dt>
					<dd className="font-semibold tabular-nums text-zinc-900">
						{formatInteger(metrics.summary.eligibleDonorsPool)}
					</dd>
				</div>
			</dl>
		</Card>
	)
}
