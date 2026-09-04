export const MetricsDashboardSkeleton = () => (
	<div className="flex flex-col gap-10">
		<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{Array.from({ length: 4 }, (_, index) => index).map((key) => (
				<div key={key} className="h-32 rounded-lg bg-zinc-200 animate-pulse" />
			))}
		</div>

		<div className="grid grid-cols-1 gap-4 md:grid-cols-12">
			{[7, 5, 7, 5].map((span, index) => (
				<div
					key={`${span}-${index}`}
					className={`col-span-12 h-96 rounded-lg bg-zinc-200 animate-pulse ${
						span === 7 ? "lg:col-span-7" : "lg:col-span-5"
					}`}
				/>
			))}
		</div>

		<div className="h-72 rounded-lg bg-zinc-200 animate-pulse" />
	</div>
)
