import { Card } from "@/presentation/components/ui/Card"

export const DailyMetricsSkeleton = () => {
	return Array.from({ length: 4 }, (_, index) => index).map((key) => (
		<Card key={key} className="flex-row items-center gap-4 p-4">
			<div className="size-11 rounded-lg bg-zinc-200 animate-pulse shrink-0" />
			<div className="flex flex-col gap-2">
				<div className="h-7 w-16 rounded bg-zinc-200 animate-pulse" />
				<div className="h-4 w-32 rounded bg-zinc-200 animate-pulse" />
			</div>
		</Card>
	))
}
