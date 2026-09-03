import { ArrowUpRight, Plus } from "lucide-react"
import { formatDate } from "@/utils/formatDate"
import { useCampaigns } from "../hooks/useCampaigns"
import { useCampaignsFilters } from "../hooks/useCampaignsFilters"
import { CAMPAIGN_STATUS_LABELS } from "../data/campaignStatusLabels"
import { CampaignDetailsDialog } from "./CampaignDetailsDialog"
import { CampaignKindBadge } from "./CampaignKindBadge"
import { CampaignsFilters } from "./CampaignsFilters"
import { Button } from "./ui/Button"
import { Card } from "./ui/Card"
import Pagination from "./ui/Pagination"
import { twMerge } from "tailwind-merge"
import { CAMPAIGN_STATUS_CONFIG } from "../data/campaignStatusConfig"
import { Link } from "@tanstack/react-router"
import { PagesEnum } from "../enums/PagesEnum"
import { Tooltip } from "./ui/Tooltip"

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

				<Button size="icon-lg" asChild>
					<Link to={PagesEnum.NEW_CAMPAIGN} className="relative group">
						<Plus className="size-4.5" />
						<Tooltip label="Nova campanha" direction="left" />
					</Link>
				</Button>
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
								<span className="flex items-center gap-2">
									{/*
									 * The kind is what the metrics comparison is drawn along, so a
									 * campaign in the list has to say which arm it belongs to.
									 */}
									<CampaignKindBadge
										kind={campaign.kind}
										bloodType={campaign.bloodType}
										showIcon={false}
									/>
									<CampaignDetailsDialog campaign={campaign}>
										<button
											type="button"
											aria-label={`Ver detalhes da campanha ${campaign.title}`}
											className="rounded-md text-zinc-900 transition-colors duration-150 hover:text-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
										>
											<ArrowUpRight className="size-7" />
										</button>
									</CampaignDetailsDialog>
								</span>
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
