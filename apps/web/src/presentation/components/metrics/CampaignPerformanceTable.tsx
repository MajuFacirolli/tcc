import type { IMetricsVM } from "@/domain/viewmodels/MetricsVM"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/presentation/components/ui/Table"
import {
	formatDate,
	formatInteger,
	formatPercent,
	formatResponseTime,
} from "@/presentation/utils/formatMetrics"

interface ICampaignPerformanceTableProps {
	metrics: IMetricsVM
	className?: string
}

/**
 * Newest first, because the decision it supports is what to send next. The response
 * rate is the column to sort a judgement on; the volumes are there to say whether the
 * rate rests on enough sends to mean anything.
 */
export const CampaignPerformanceTable = ({
	metrics,
	className,
}: ICampaignPerformanceTableProps) => (
	<section className={className}>
		<Table>
			<TableHeader>
				<TableRow className="bg-zinc-100">
					<TableHead>Campanha</TableHead>
					<TableHead className="w-28">Envio</TableHead>
					<TableHead className="w-24 text-right">Envios</TableHead>
					<TableHead className="w-24 text-right">Intenções</TableHead>
					<TableHead className="w-28 text-right">Resposta</TableHead>
					<TableHead className="w-32 text-right">Tempo médio</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{metrics.campaigns.length === 0 && (
					<TableRow>
						<TableCell colSpan={6} className="py-12 text-center">
							<p className="text-sm text-zinc-500">
								Nenhuma campanha nos últimos {metrics.windowDays} dias.
							</p>
						</TableCell>
					</TableRow>
				)}

				{metrics.campaigns.map((campaign) => (
					<TableRow key={campaign.id}>
						<TableCell className="font-medium text-zinc-900">
							{campaign.title}
						</TableCell>
						<TableCell className="text-zinc-500 tabular-nums">
							{formatDate(campaign.createdAt)}
						</TableCell>
						<TableCell className="text-right tabular-nums">
							{formatInteger(campaign.notifications)}
						</TableCell>
						<TableCell className="text-right tabular-nums">
							{formatInteger(campaign.intentions)}
						</TableCell>
						<TableCell className="text-right font-semibold tabular-nums text-zinc-900">
							{formatPercent(campaign.responseRate)}
						</TableCell>
						<TableCell className="text-right tabular-nums">
							{formatResponseTime(campaign.averageResponseTime)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	</section>
)
