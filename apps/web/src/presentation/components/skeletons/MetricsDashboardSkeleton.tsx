export const MetricsDashboardSkeleton = () => {
	return (
		<div className="flex flex-col gap-10">
			<div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
				{Array.from({ length: 4 }, (_, index) => index).map((key) => (
					<div
						key={key}
						className="h-28 rounded-lg bg-zinc-200 animate-pulse"
					/>
				))}
			</div>
			<div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 gap-x-4">
				{Array.from({ length: 4 }, (_, index) => index).map((key) => (
					<div
						key={key}
						className={
							key % 2 === 0
								? "col-span-12 lg:col-span-8 h-96 rounded-lg bg-zinc-200 animate-pulse"
								: "col-span-12 lg:col-span-4 h-96 rounded-lg bg-zinc-200 animate-pulse"
						}
					/>
				))}
			</div>
		</div>
	)
}
