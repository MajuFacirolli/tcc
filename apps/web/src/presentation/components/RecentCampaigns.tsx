import { Link } from "@tanstack/react-router"
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { PagesEnum } from "@/presentation/enums/PagesEnum"
import { useCampaignsSummary } from "../hooks/useCampaignsSummary"

export const RecentCampaigns = () => {
	const { campaignsSummary, error, isFetching, isLoading } =
		useCampaignsSummary()

	const hasData = !!campaignsSummary?.length

	return (
		<aside className="col-span-6 flex flex-col gap-6">
			<div className="w-full flex items-center justify-between">
				<h3 className="typography-overline">Campanhas recentes</h3>
				<Link
					to={PagesEnum.CAMPAIGNS}
					className="uppercase text-xs flex items-center gap-1 text-red-800 hover:text-red-700 transition-all duration-150"
				>
					Ver todas
					<ArrowRight className="size-4" />
				</Link>
			</div>

			{isLoading && (
				<div className="bg-white shadow-sm rounded-lg divide-y divide-zinc-300">
					{Array.from({ length: 3 }, (_, index) => index).map((key) => (
						<div key={key} className="px-5 py-4 flex flex-col gap-2">
							<div className="h-4 w-2/5 rounded bg-zinc-200 animate-pulse" />
							<div className="h-3 w-3/5 rounded bg-zinc-200 animate-pulse" />
						</div>
					))}
				</div>
			)}

			{!isLoading && error && (
				<div className="bg-white shadow-sm rounded-lg px-5 py-16 text-center">
					<p className="text-sm text-zinc-500">
						Não foi possível carregar as campanhas recentes.
					</p>
				</div>
			)}

			{!isLoading && !error && !hasData && (
				<div className="bg-white shadow-sm rounded-lg px-5 py-16 text-center">
					<p className="text-sm text-zinc-500">
						Ainda não há campanhas cadastradas
					</p>
				</div>
			)}

			{hasData && !isLoading && !error && (
				<div
					className="bg-white shadow-sm rounded-lg divide-y divide-zinc-300"
					data-fetching={isFetching}
					aria-busy={isFetching}
				>
					{campaignsSummary.map((campaign) => (
						<div
							key={campaign.id}
							className="px-5 py-4 flex items-center justify-between transition-opacity duration-150 in-data-[fetching=true]:opacity-60"
						>
							<div className="min-w-0 flex-1 pr-4">
								<p className="text-sm font-medium truncate">{campaign.title}</p>
								<div className="flex items-center gap-2 mt-1">
									<span className="text-xs font-semibold border border-zinc-300 text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
										{campaign.bloodType}
									</span>
									<span className="text-xs text-zinc-500">
										{campaign.notifiedCount} notificados
									</span>
								</div>
							</div>
							<div className="text-right shrink-0">
								<div
									className={twMerge(
										"flex items-center justify-end gap-1 text-sm font-semibold ",
										campaign.conversionRate >= 50
											? "text-emerald-700"
											: "text-red-600",
									)}
								>
									{campaign.conversionRate >= 50 ? (
										<TrendingUp className="w-3.5 h-3.5" />
									) : (
										<TrendingDown className="w-3.5 h-3.5" />
									)}
									{campaign.conversionRate.toFixed(1)}%
								</div>
								<p className="text-xs text-zinc-500">conversão</p>
							</div>
						</div>
					))}
				</div>
			)}
		</aside>
	)
}
