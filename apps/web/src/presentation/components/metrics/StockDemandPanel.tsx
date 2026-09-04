import { Droplet } from "lucide-react"
import type {
	IMetricsBloodTypeVM,
	IMetricsVM,
} from "@/domain/viewmodels/MetricsVM"
import { Badge } from "@/presentation/components/ui/Badge"
import { Card } from "@/presentation/components/ui/Card"
import {
	formatInteger,
	formatPercent,
	formatSigned,
} from "@/presentation/utils/formatMetrics"

/**
 * The page's operating question: for each blood type, how far the shelf sits from its
 * safety minimum, and how well that type answers when asked.
 *
 * The two measures are deliberately *not* on one axis — bags and percentages do not
 * share a scale. Each gets its own track, and the rows are ordered by shortfall so the
 * type that needs the next campaign is the first one read.
 */

const stockLabel = (balance: number) =>
	balance < 0 ? "Abaixo do mínimo" : "Acima do mínimo"

interface IRowProps {
	row: IMetricsBloodTypeVM
	/** Largest absolute balance in the set, so every bar shares one scale. */
	balanceScale: number
	/** Largest response rate in the set, so the rate bars share one scale. */
	rateScale: number
}

const StockRow = ({ row, balanceScale, rateScale }: IRowProps) => {
	const isShort = row.stockBalance < 0
	const balanceWidth =
		balanceScale === 0 ? 0 : (Math.abs(row.stockBalance) / balanceScale) * 100
	const rateWidth = rateScale === 0 ? 0 : (row.responseRate / rateScale) * 100

	return (
		<tr className="border-t border-zinc-100">
			<th scope="row" className="py-3 pr-3 text-left">
				<span className="font-semibold tabular-nums text-zinc-900">
					{row.bloodType}
				</span>
			</th>

			<td className="py-3 pr-3">
				{/* Diverging around the minimum: left of centre is a shortfall. */}
				<div className="flex items-center" aria-hidden="true">
					<div className="flex h-2 w-1/2 justify-end">
						{isShort && (
							<div
								className="h-full rounded-l-full"
								style={{
									width: `${balanceWidth}%`,
									backgroundColor: "var(--chart-negative)",
								}}
							/>
						)}
					</div>
					<div className="h-4 w-px shrink-0 bg-zinc-400" />
					<div className="flex h-2 w-1/2">
						{!isShort && (
							<div
								className="h-full rounded-r-full"
								style={{
									width: `${balanceWidth}%`,
									backgroundColor: "var(--chart-positive)",
								}}
							/>
						)}
					</div>
				</div>
			</td>

			<td className="py-3 pr-4 text-right">
				<span
					className={`text-sm font-semibold tabular-nums ${
						isShort ? "text-red-700" : "text-zinc-900"
					}`}
				>
					{formatSigned(row.stockBalance)}
				</span>
			</td>

			<td className="py-3">
				<div className="flex items-center gap-3">
					<div
						aria-hidden="true"
						className="h-2 w-full min-w-8 overflow-hidden rounded-full bg-zinc-100"
					>
						<div
							className="h-full rounded-full"
							style={{
								width: `${rateWidth}%`,
								backgroundColor: "var(--chart-primary)",
							}}
						/>
					</div>
					<span className="w-14 shrink-0 text-right text-sm font-semibold tabular-nums text-zinc-900">
						{formatPercent(row.responseRate)}
					</span>
				</div>
			</td>

			{/* The denominator, so a rate off 21 sends is not read like one off 2.500. */}
			<td className="py-3 pl-3 text-right text-xs text-zinc-500 tabular-nums">
				{formatInteger(row.notifications)}
			</td>
		</tr>
	)
}

interface IStockDemandPanelProps {
	metrics: IMetricsVM
	className?: string
}

export const StockDemandPanel = ({
	metrics,
	className,
}: IStockDemandPanelProps) => {
	const rows = metrics.byBloodType
	const balanceScale = Math.max(
		...rows.map((row) => Math.abs(row.stockBalance)),
		1,
	)
	const rateScale = Math.max(...rows.map((row) => row.responseRate), 1)
	const shortTypes = rows.filter((row) => row.stockBalance < 0)

	return (
		<Card className={className}>
			<div className="flex items-start justify-between gap-3">
				<div className="flex flex-col gap-1">
					<Card.Title>Estoque e resposta por tipo</Card.Title>
					<Card.Description>
						Bolsas em relação ao mínimo, e a taxa de resposta do tipo.
					</Card.Description>
				</div>
				{shortTypes.length > 0 && (
					<Badge variant="destructive">
						{shortTypes.length}{" "}
						{shortTypes.length === 1 ? "tipo abaixo" : "tipos abaixo"}
					</Badge>
				)}
			</div>

			<div className="overflow-x-auto">
				<table className="w-full min-w-md text-sm">
					<caption className="sr-only">
						Saldo de bolsas e taxa de resposta por tipo sanguíneo
					</caption>
					<thead>
						<tr className="text-xs text-zinc-500">
							<th scope="col" className="w-10 pb-2 text-left font-medium">
								Tipo
							</th>
							<th scope="col" className="pb-2 text-left font-medium">
								Saldo de bolsas
							</th>
							<th scope="col" className="pb-2 text-right font-medium">
								<span className="sr-only">Bolsas</span>
							</th>
							<th scope="col" className="w-2/5 pb-2 text-left font-medium">
								Taxa de resposta
							</th>
							<th scope="col" className="pb-2 pl-3 text-right font-medium">
								Envios
							</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row) => (
							<StockRow
								key={row.bloodType}
								row={row}
								balanceScale={balanceScale}
								rateScale={rateScale}
							/>
						))}
					</tbody>
				</table>
			</div>

			<dl className="sr-only">
				{rows.map((row) => (
					<div key={row.bloodType}>
						<dt>{row.bloodType}</dt>
						<dd>
							{formatInteger(row.bagsCount)} bolsas,{" "}
							{stockLabel(row.stockBalance).toLowerCase()} de{" "}
							{formatInteger(row.minThreshold)}. Taxa de resposta{" "}
							{formatPercent(row.responseRate)} em{" "}
							{formatInteger(row.notifications)} envios.
						</dd>
					</div>
				))}
			</dl>

			<p className="flex items-center gap-2 border-t border-zinc-200 pt-3 text-xs text-zinc-500">
				<Droplet className="size-3.5 shrink-0" aria-hidden="true" />
				Mínimo de segurança: {formatInteger(rows[0]?.minThreshold ?? 0)} bolsas
			</p>
		</Card>
	)
}
