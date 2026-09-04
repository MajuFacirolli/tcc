import { TableCell, TableRow } from "../ui/Table"

const CELL_WIDTHS = ["w-56", "w-28", "w-20", "w-12", "w-12", "w-12", "w-20"]

export const CampaignsTableSkeleton = ({ rows = 9 }: { rows?: number }) =>
	Array.from({ length: rows }, (_, index) => index).map((key) => (
		<TableRow key={key}>
			{CELL_WIDTHS.map((width) => (
				<TableCell key={width}>
					<div className={`h-4 ${width} rounded bg-zinc-200 animate-pulse`} />
				</TableCell>
			))}
		</TableRow>
	))
