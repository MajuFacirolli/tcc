import { formatShortDate } from "@/utils/formatDate"
import { useCampaigns } from "../hooks/useCampaigns"
import { useCampaignsFilters } from "../hooks/useCampaignsFilters"
import { CAMPAIGN_STATUS_BADGE_VARIANT } from "../data/campaignStatusBadge"
import { CAMPAIGN_STATUS_LABELS } from "../data/campaignStatusLabels"
import { formatInteger, formatPercent } from "../utils/formatMetrics"
import { CampaignKindBadge } from "./CampaignKindBadge"
import { CampaignsFilters } from "./CampaignsFilters"
import { CampaignsTableSkeleton } from "./skeletons/CampaignsTableSkeleton"
import { Badge } from "./ui/Badge"
import { Button } from "./ui/Button"
import Pagination from "./ui/Pagination"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/Table"

const COLUMNS_COUNT = 7

export const CampaignsList = () => {
	const { filters, setFilters, clearFilters, hasFilters } =
		useCampaignsFilters()

	const { campaigns, page, lastPage, isLoading, isFetching, error } =
		useCampaigns(filters)

	const hasData = !!campaigns?.length

	return (
		<section className="flex flex-col gap-6">
			<CampaignsFilters
				filters={filters}
				setFilters={setFilters}
				clearFilters={clearFilters}
				hasFilters={hasFilters}
			/>

			<Table>
				<TableHeader>
					<TableRow className="bg-zinc-100">
						<TableHead>Campanha</TableHead>
						<TableHead className="w-40">Tipo</TableHead>
						<TableHead className="w-32">Status</TableHead>
						<TableHead className="w-24 text-right">Envios</TableHead>
						<TableHead className="w-24 text-right">Intenções</TableHead>
						<TableHead className="w-24 text-right">Resposta</TableHead>
						<TableHead className="w-28">Criada em</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody
					data-fetching={isFetching}
					aria-busy={isFetching}
					className="bg-white"
				>
					{isLoading && <CampaignsTableSkeleton />}

					{!isLoading && error && (
						<TableRow>
							<TableCell colSpan={COLUMNS_COUNT} className="py-16 text-center">
								<p className="text-sm text-zinc-500">
									Não foi possível carregar as campanhas.
								</p>
							</TableCell>
						</TableRow>
					)}

					{!isLoading && !error && !hasData && (
						<TableRow>
							<TableCell colSpan={COLUMNS_COUNT} className="py-16 text-center">
								<div className="flex flex-col items-center gap-3">
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
							</TableCell>
						</TableRow>
					)}

					{!isLoading &&
						!error &&
						hasData &&
						campaigns.map((campaign) => (
							<TableRow
								key={campaign.id}
								className="transition-opacity duration-150 in-data-[fetching=true]:opacity-60"
							>
								<TableCell className="font-medium text-zinc-900">
									{campaign.title}
								</TableCell>
								<TableCell>
									<CampaignKindBadge
										kind={campaign.kind}
										bloodType={campaign.bloodType}
										showIcon={false}
									/>
								</TableCell>
								<TableCell>
									<Badge
										variant={CAMPAIGN_STATUS_BADGE_VARIANT[campaign.status]}
									>
										{CAMPAIGN_STATUS_LABELS[campaign.status]}
									</Badge>
								</TableCell>
								<TableCell className="text-right tabular-nums">
									{formatInteger(campaign.notifiedCount)}
								</TableCell>
								<TableCell className="text-right tabular-nums">
									{formatInteger(campaign.confirmationsCount)}
								</TableCell>
								<TableCell className="text-right font-semibold tabular-nums text-zinc-900">
									{formatPercent(campaign.conversionRate)}
								</TableCell>
								<TableCell className="tabular-nums text-zinc-600">
									<time dateTime={campaign.createdAt.toISOString()}>
										{formatShortDate(campaign.createdAt)}
									</time>
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>

			{!isLoading && !error && lastPage > 1 && (
				<Pagination value={page} lastPage={lastPage} setParam={setFilters} />
			)}
		</section>
	)
}
