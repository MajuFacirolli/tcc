import { createFileRoute } from "@tanstack/react-router"
import { ConfirmationsByBloodTypeChart } from "@/presentation/components/metrics/ConfirmationsByBloodTypeChart"
import { ConfirmationsOverTimeChart } from "@/presentation/components/metrics/ConfirmationsOverTimeChart"
import { ConversionFunnelChart } from "@/presentation/components/metrics/ConversionFunnelChart"
import { ConversionRateMeter } from "@/presentation/components/metrics/ConversionRateMeter"
import { MetricsFilters } from "@/presentation/components/metrics/MetricsFilters"
import { MetricsSummary } from "@/presentation/components/metrics/MetricsSummary"
import { Heading } from "@/presentation/components/ui/Heading"
import { useMetrics } from "@/presentation/hooks/useMetrics"
import { useMetricsFilters } from "@/presentation/hooks/useMetricsFilters"
import { MetricsDashboardSkeleton } from "@/presentation/components/skeletons/MetricsDashboardSkeleton"

export const Route = createFileRoute("/_dashboard/metricas")({
	component: RouteComponent,
})

function RouteComponent() {
	const { period, setPeriod } = useMetricsFilters()
	const { metrics, isLoading, isFetching, error } = useMetrics(period)

	return (
		<div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-10">
			<Heading>
				<Heading.Overline>Desempenho</Heading.Overline>
				<Heading.Title>Métricas</Heading.Title>
				<Heading.Description>
					Acompanhe o desempenho das campanhas e identifique oportunidades para
					melhorar a mobilização de doadores.
				</Heading.Description>
			</Heading>

			<MetricsFilters
				period={period}
				onPeriodChange={setPeriod}
				range={metrics?.range}
			/>

			{isLoading && <MetricsDashboardSkeleton />}

			{!isLoading && error && (
				<div className="flex flex-col items-center gap-3 py-16 text-center">
					<p className="text-sm text-zinc-500">
						Não foi possível carregar as métricas.
					</p>
				</div>
			)}

			{!isLoading && !error && metrics && (
				<div
					className="flex flex-col gap-10"
					data-fetching={isFetching}
					aria-busy={isFetching}
				>
					<div className="in-data-[fetching=true]:opacity-60 transition-opacity">
						<MetricsSummary metrics={metrics} />
					</div>

					<section className="flex flex-col gap-6 in-data-[fetching=true]:opacity-60 transition-opacity">
						<h3 className="typography-overline">Análise das campanhas</h3>

						<div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 gap-x-4">
							<ConversionFunnelChart
								metrics={metrics}
								className="col-span-12 min-w-0 lg:col-span-8"
							/>
							<ConversionRateMeter
								metrics={metrics}
								className="col-span-12 min-w-0 lg:col-span-4"
							/>
							<ConfirmationsOverTimeChart
								metrics={metrics}
								className="col-span-12 min-w-0 lg:col-span-8"
							/>
							<ConfirmationsByBloodTypeChart
								metrics={metrics}
								className="col-span-12 min-w-0 lg:col-span-4"
							/>
						</div>
					</section>
				</div>
			)}
		</div>
	)
}
