import { CalendarDays } from "lucide-react"
import { twMerge } from "tailwind-merge"
import type { CampaignVM } from "@/domain/viewmodels/CampaignVM"
import { formatDate } from "@/utils/formatDate"
import { CAMPAIGN_STATUS_CONFIG } from "../data/campaignStatusConfig"
import { CAMPAIGN_STATUS_LABELS } from "../data/campaignStatusLabels"
import { formatInteger, formatPercent } from "../utils/formatMetrics"
import { CampaignKindBadge } from "./CampaignKindBadge"
import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "./ui/Drawer"

interface IStatProps {
	label: string
	value: string
}

const Stat = ({ label, value }: IStatProps) => (
	<div className="flex flex-col gap-1 rounded-lg bg-zinc-50 px-4 py-3">
		<span className="text-sm text-zinc-500">{label}</span>
		<span className="text-2xl font-bold tabular-nums text-zinc-900">
			{value}
		</span>
	</div>
)

interface ICampaignDetailsDrawerProps {
	campaign: CampaignVM
	children: React.ReactNode
}

export const CampaignDetailsDrawer = ({
	campaign,
	children,
}: ICampaignDetailsDrawerProps) => (
	<Drawer>
		<DrawerTrigger asChild>{children}</DrawerTrigger>
		<DrawerContent>
			<DrawerHeader>
				<div className="flex flex-wrap items-center gap-2">
					<span className="flex items-center gap-1.5 text-sm text-zinc-500">
						<span
							aria-hidden="true"
							className={twMerge(
								"size-2 rounded-full",
								CAMPAIGN_STATUS_CONFIG[campaign.status],
							)}
						/>
						{CAMPAIGN_STATUS_LABELS[campaign.status]}
					</span>
					<CampaignKindBadge
						kind={campaign.kind}
						bloodType={campaign.bloodType}
						className="text-sm"
					/>
				</div>

				<DrawerTitle>{campaign.title}</DrawerTitle>

				<DrawerDescription className="flex items-center gap-1.5">
					<CalendarDays className="size-4 shrink-0" aria-hidden="true" />
					<time dateTime={campaign.createdAt.toISOString()}>
						{formatDate(campaign.createdAt)}
					</time>
				</DrawerDescription>
			</DrawerHeader>

			<DrawerBody>
				<div className="grid grid-cols-2 gap-3">
					<Stat label="Envios" value={formatInteger(campaign.notifiedCount)} />
					<Stat
						label="A doadores elegíveis"
						value={formatInteger(campaign.eligibleReached)}
					/>
					<Stat
						label="Intenções"
						value={formatInteger(campaign.confirmationsCount)}
					/>
					<Stat
						label="Taxa de resposta"
						value={formatPercent(campaign.conversionRate)}
					/>
				</div>

				<section className="flex flex-col gap-2">
					<h4 className="text-sm font-semibold text-zinc-900">Mensagem</h4>
					<p className="rounded-lg border border-zinc-200 px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap text-zinc-700">
						{campaign.message}
					</p>
				</section>
			</DrawerBody>
		</DrawerContent>
	</Drawer>
)
