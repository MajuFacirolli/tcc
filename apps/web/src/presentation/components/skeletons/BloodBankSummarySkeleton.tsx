import { TableCell, TableRow } from "../ui/Table"

export const BloodBankSummarySkeleton = () => {
	return Array.from({ length: 8 }, (_, index) => index).map((key) => (
		<TableRow key={key}>
			<TableCell>
				<div className="h-4 w-8 rounded bg-zinc-200 animate-pulse" />
			</TableCell>
			<TableCell>
				<div className="h-5 w-20 rounded-full bg-zinc-200 animate-pulse" />
			</TableCell>
			<TableCell className="flex justify-end">
				<div className="size-9 rounded-lg bg-zinc-200 animate-pulse" />
			</TableCell>
		</TableRow>
	))
}
