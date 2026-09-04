import { TableCell, TableRow } from "../ui/Table"

const CELL_WIDTHS = ["w-40", "w-52", "w-10", "w-20", "w-20", "w-24"]

export const DonorsTableSkeleton = ({ rows = 9 }: { rows?: number }) =>
	Array.from({ length: rows }, (_, index) => index).map((key) => (
		<TableRow key={key}>
			{CELL_WIDTHS.map((width) => (
				<TableCell key={width}>
					<div className={`h-4 ${width} rounded bg-zinc-200 animate-pulse`} />
				</TableCell>
			))}
		</TableRow>
	))
