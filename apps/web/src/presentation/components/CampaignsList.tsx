import { ArrowUpRight, Plus } from "lucide-react"
import { formatDate } from "@/utils/formatDate"
import { useCampaigns } from "../hooks/useCampaigns"
import { useCampaignsFilters } from "../hooks/useCampaignsFilters"
import { CAMPAIGN_STATUS_LABELS } from "../data/campaignStatusLabels"
import { CampaignsFilters } from "./CampaignsFilters"
import { Button } from "./ui/Button"
import { Card } from "./ui/Card"
import Pagination from "./ui/Pagination"
import { twMerge } from "tailwind-merge"
import { CAMPAIGN_STATUS_CONFIG } from "../data/campaignStatusConfig"

export const CampaignsList = () => {
	const { filters, setFilters, clearFilters, hasFilters } =
		useCampaignsFilters()

	const { campaigns, page, lastPage, isLoading, isFetching, error } =
		useCampaigns(filters)

	const hasData = !!campaigns?.length

	return (
		<section className="flex flex-col gap-6">
			<div className="flex items-center justify-between gap-2">
				<CampaignsFilters
					filters={filters}
					setFilters={setFilters}
					clearFilters={clearFilters}
					hasFilters={hasFilters}
				/>

				<button
					type="button"
					className={twMerge(
						"group flex items-center justify-center gap-3 p-2.5 rounded-lg text-sm font-medium bg-red-800 text-white",
						"hover:bg-red-900 cursor-pointer",
					)}
				>
					<Plus className="size-4.5" />
				</button>
			</div>

			{isLoading && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
					{Array.from({ length: 9 }, (_, index) => index).map((key) => (
						<div
							key={key}
							className="min-h-60 rounded-lg bg-zinc-200 animate-pulse"
						/>
					))}
				</div>
			)}

			{!isLoading && error && (
				<div className="flex flex-col items-center gap-3 py-16 text-center">
					<p className="text-sm text-zinc-500">
						Não foi possível carregar as campanhas.
					</p>
				</div>
			)}

			{!isLoading && !error && !hasData && (
				<div className="flex flex-col items-center gap-3 py-16 text-center">
					<p className="text-sm text-zinc-500">
						{hasFilters
							? "Nenhuma campanha corresponde aos filtros selecionados."
							: "Ainda não há campanhas cadastradas"}
					</p>
					{hasFilters && (
						<Button variant="outline" size="sm" onClick={clearFilters}>
							Limpar filtros
						</Button>
					)}
				</div>
			)}

			{hasData && !isLoading && !error && (
				<div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
					data-fetching={isFetching}
					aria-busy={isFetching}
				>
					{campaigns.map((campaign) => (
						<Card
							key={campaign.id}
							className="flex flex-col justify-between min-h-60 transition-opacity duration-150 in-data-[fetching=true]:opacity-60"
						>
							<div className="flex items-center justify-between gap-2">
								<p className="typography-overline flex items-center gap-1">
									<span
										className={twMerge(
											"rounded-full h-2 w-2",
											CAMPAIGN_STATUS_CONFIG[campaign.status],
										)}
									/>
									{CAMPAIGN_STATUS_LABELS[campaign.status]}
								</p>
								<ArrowUpRight className="size-7" />
							</div>

							<div className="flex flex-col gap-2">
								<Card.Title className="uppercase text-xl line-clamp-3">
									{campaign.title}
								</Card.Title>
								<time
									className="text-sm"
									dateTime={campaign.createdAt.toISOString()}
								>
									{formatDate(campaign.createdAt)}
								</time>
							</div>
						</Card>
					))}
				</div>
			)}

			{!isLoading && !error && lastPage > 1 && (
				<Pagination value={page} lastPage={lastPage} setParam={setFilters} />
			)}
		</section>
	)
}
