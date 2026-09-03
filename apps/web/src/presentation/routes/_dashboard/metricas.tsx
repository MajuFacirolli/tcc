import { createFileRoute } from "@tanstack/react-router"
import { ConfirmationsByBloodTypeChart } from "@/presentation/components/metrics/ConfirmationsByBloodTypeChart"
import { ConfirmationsOverTimeChart } from "@/presentation/components/metrics/ConfirmationsOverTimeChart"
import { CoreMetricsComparison } from "@/presentation/components/metrics/CoreMetricsComparison"
import { MetricsFilters } from "@/presentation/components/metrics/MetricsFilters"
import { SegmentationComparisonChart } from "@/presentation/components/metrics/SegmentationComparisonChart"
import { SegmentationTable } from "@/presentation/components/metrics/SegmentationTable"
import { SegmentationVerdict } from "@/presentation/components/metrics/SegmentationVerdict"
import { MetricsDashboardSkeleton } from "@/presentation/components/skeletons/MetricsDashboardSkeleton"
import { Heading } from "@/presentation/components/ui/Heading"
import { useMetrics } from "@/presentation/hooks/useMetrics"
import { useMetricsFilters } from "@/presentation/hooks/useMetricsFilters"

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
					Campanhas segmentadas por elegibilidade e tipo sanguíneo, comparadas
					ao envio genérico.
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
					className="flex flex-col gap-12"
					data-fetching={isFetching}
					aria-busy={isFetching}
				>
					<section className="flex flex-col gap-6 in-data-[fetching=true]:opacity-60 transition-opacity">
						<h3 className="typography-overline">Métricas por estratégia</h3>

						<CoreMetricsComparison metrics={metrics} />
					</section>

					<section className="flex flex-col gap-6 in-data-[fetching=true]:opacity-60 transition-opacity">
						<h3 className="typography-overline">O que a segmentação muda</h3>

						<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
							<SegmentationVerdict
								metrics={metrics}
								className="col-span-12 min-w-0 lg:col-span-5"
							/>
							<SegmentationComparisonChart
								metrics={metrics}
								className="col-span-12 min-w-0 lg:col-span-7"
							/>
							<SegmentationTable
								metrics={metrics}
								className="col-span-12 min-w-0"
							/>
						</div>
					</section>

					<section className="flex flex-col gap-6 in-data-[fetching=true]:opacity-60 transition-opacity">
						<h3 className="typography-overline">Atividade no período</h3>

						<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
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
