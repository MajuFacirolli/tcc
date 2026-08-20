import type { TooltipContentProps } from "recharts"

interface IChartTooltipProps
	extends Partial<
		Pick<TooltipContentProps<number, string>, "active" | "payload">
	> {
	/** Formats the numeric value; defaults to a pt-BR integer. */
	formatValue?: (value: number) => string
	/** Noun shown under the value, e.g. "confirmações". */
	unit?: string
}

export const ChartTooltip = ({
	active,
	payload,
	formatValue = (value) => value.toLocaleString("pt-BR"),
	unit,
}: IChartTooltipProps) => {
	const entry = payload?.[0]

	if (!active || !entry) return null

	return (
		<div className="bg-white rounded-lg shadow-sm border border-zinc-200 px-3 py-2">
			<p className="typography-overline">{entry.payload.label ?? entry.name}</p>
			<p className="text-sm font-semibold text-zinc-900">
				{formatValue(Number(entry.value))}
				{unit ? (
					<span className="font-normal text-zinc-500"> {unit}</span>
				) : null}
			</p>
		</div>
	)
}
