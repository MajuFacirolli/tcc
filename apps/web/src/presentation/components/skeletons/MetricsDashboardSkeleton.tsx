const Block = ({ className }: { className: string }) => (
	<div className={`rounded-lg bg-zinc-200 animate-pulse ${className}`} />
)

/** Mirrors the metrics page: the four measure cards, the comparison, the activity charts. */
export const MetricsDashboardSkeleton = () => (
	<div className="flex flex-col gap-12">
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{Array.from({ length: 4 }, (_, index) => index).map((key) => (
				<Block key={key} className="h-60" />
			))}
		</div>

		<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
			<Block className="col-span-12 lg:col-span-5 h-96" />
			<Block className="col-span-12 lg:col-span-7 h-96" />
			<Block className="col-span-12 h-80" />
		</div>

		<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
			<Block className="col-span-12 lg:col-span-8 h-96" />
			<Block className="col-span-12 lg:col-span-4 h-96" />
		</div>
	</div>
)
