import { Calendar } from "lucide-react"
import { METRICS_PERIOD_LABELS } from "@/presentation/data/metricsPeriodLabels"
import {
	METRICS_PERIODS,
	type MetricsPeriodEnum,
} from "@/presentation/enums/MetricsPeriodEnum"
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@/presentation/components/ui/ToggleGroup"
import { formatPeriodRange } from "@/presentation/utils/formatMetrics"

interface IMetricsFiltersProps {
	period: MetricsPeriodEnum
	onPeriodChange: (period: MetricsPeriodEnum) => void
	range?: { from: Date; to: Date }
}

export const MetricsFilters = ({
	period,
	onPeriodChange,
	range,
}: IMetricsFiltersProps) => (
	<div className="flex flex-wrap items-center justify-between gap-4">
		{range && (
			<p className="flex items-center gap-2 text-sm text-zinc-500">
				<Calendar className="size-4 shrink-0" />
				{formatPeriodRange(range.from, range.to)}
			</p>
		)}

		<ToggleGroup
			type="single"
			value={period}
			aria-label="Período das métricas"
			onValueChange={(value) => {
				if (value) onPeriodChange(value as MetricsPeriodEnum)
			}}
		>
			{METRICS_PERIODS.map((option) => (
				<ToggleGroupItem key={option} value={option}>
					{METRICS_PERIOD_LABELS[option]}
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	</div>
)
