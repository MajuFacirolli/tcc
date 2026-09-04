import { createFileRoute } from "@tanstack/react-router"
import { Calendar } from "lucide-react"
import { CampaignPerformanceTable } from "@/presentation/components/metrics/CampaignPerformanceTable"
import { IntentionsOverTimeChart } from "@/presentation/components/metrics/IntentionsOverTimeChart"
import { MetricsHeadline } from "@/presentation/components/metrics/MetricsHeadline"
import { ResponseSpeedChart } from "@/presentation/components/metrics/ResponseSpeedChart"
import { RetentionPanel } from "@/presentation/components/metrics/RetentionPanel"
import { StockDemandPanel } from "@/presentation/components/metrics/StockDemandPanel"
import { MetricsDashboardSkeleton } from "@/presentation/components/skeletons/MetricsDashboardSkeleton"
import { Heading } from "@/presentation/components/ui/Heading"
import { useMetrics } from "@/presentation/hooks/useMetrics"
import { formatPeriodRange } from "@/presentation/utils/formatMetrics"

export const Route = createFileRoute("/_dashboard/metricas")({
	component: RouteComponent,
})

function RouteComponent() {
	const { metrics, isLoading, error } = useMetrics()

	return (
		<div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<Heading>
					<Heading.Overline>Desempenho</Heading.Overline>
					<Heading.Title>Métricas</Heading.Title>
				</Heading>

				{/* One fixed window for the whole page, so no two panels can disagree. */}
				<p className="flex items-center gap-2 text-sm text-zinc-500">
					<Calendar className="size-4 shrink-0" aria-hidden="true" />
					Últimos {metrics?.windowDays ?? 30} dias
					{metrics &&
						` · ${formatPeriodRange(metrics.range.from, metrics.range.to)}`}
				</p>
			</div>

			{isLoading && <MetricsDashboardSkeleton />}

			{!isLoading && error && (
				<div className="flex flex-col items-center gap-3 py-16 text-center">
					<p className="text-sm text-zinc-500">
						Não foi possível carregar as métricas.
					</p>
				</div>
			)}

			{!isLoading && !error && metrics && (
				<div className="flex flex-col gap-10">
					<MetricsHeadline metrics={metrics} />

					<div className="grid grid-cols-1 gap-4 md:grid-cols-12">
						<StockDemandPanel
							metrics={metrics}
							className="col-span-12 min-w-0 lg:col-span-7"
						/>
						<RetentionPanel
							metrics={metrics}
							className="col-span-12 min-w-0 lg:col-span-5"
						/>
						<IntentionsOverTimeChart
							metrics={metrics}
							className="col-span-12 min-w-0 lg:col-span-7"
						/>
						<ResponseSpeedChart
							metrics={metrics}
							className="col-span-12 min-w-0 lg:col-span-5"
						/>
					</div>

					<section className="flex flex-col gap-6">
						<h3 className="typography-overline">Campanhas do período</h3>
						<CampaignPerformanceTable metrics={metrics} />
					</section>
				</div>
			)}
		</div>
	)
}
