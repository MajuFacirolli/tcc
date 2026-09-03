import { CalendarDays, Mails, Target, UserCheck, Users } from "lucide-react"
import type { LucideProps } from "lucide-react"
import { twMerge } from "tailwind-merge"
import type { CampaignVM } from "@/domain/viewmodels/CampaignVM"
import { formatDate } from "@/utils/formatDate"
import { CAMPAIGN_KIND_DESCRIPTIONS } from "../data/campaignKindLabels"
import { CAMPAIGN_STATUS_CONFIG } from "../data/campaignStatusConfig"
import { CAMPAIGN_STATUS_LABELS } from "../data/campaignStatusLabels"
import { formatInteger, formatPercent } from "../utils/formatMetrics"
import { CampaignKindBadge } from "./CampaignKindBadge"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/Dialog"

interface IStatProps {
	Icon: React.ForwardRefExoticComponent<LucideProps>
	label: string
	value: string
	hint?: string
}

const Stat = ({ Icon, label, value, hint }: IStatProps) => (
	<div className="flex flex-col gap-1 rounded-lg border border-zinc-200 px-3 py-2.5">
		<span className="flex items-center gap-1.5 text-xs text-zinc-500">
			<Icon className="size-3.5 shrink-0" aria-hidden="true" />
			{label}
		</span>
		<span className="text-lg font-bold tabular-nums text-zinc-900">
			{value}
		</span>
		{hint && <span className="text-xs text-zinc-400">{hint}</span>}
	</div>
)

interface ICampaignDetailsDialogProps {
	campaign: CampaignVM
	children: React.ReactNode
}

/**
 * Everything the list already knows about one campaign. The list endpoint returns the
 * full campaign, so opening this costs no extra request.
 */
export const CampaignDetailsDialog = ({
	campaign,
	children,
}: ICampaignDetailsDialogProps) => {
	// The share of messages that reached someone able to donate — the same quantity the
	// metrics page compares across arms, here for a single campaign.
	const targetingPrecision =
		campaign.notifiedCount === 0
			? 0
			: (campaign.eligibleReached / campaign.notifiedCount) * 100

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="max-h-[85vh] gap-5 overflow-y-auto sm:max-w-2xl">
				<DialogHeader>
					<div className="flex flex-wrap items-center gap-2">
						<span className="typography-overline flex items-center gap-1.5">
							<span
								className={twMerge(
									"h-2 w-2 rounded-full",
									CAMPAIGN_STATUS_CONFIG[campaign.status],
								)}
							/>
							{CAMPAIGN_STATUS_LABELS[campaign.status]}
						</span>
						<CampaignKindBadge
							kind={campaign.kind}
							bloodType={campaign.bloodType}
						/>
					</div>

					<DialogTitle className="text-xl uppercase">
						{campaign.title}
					</DialogTitle>

					<DialogDescription className="flex items-center gap-1.5">
						<CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
						<time dateTime={campaign.createdAt.toISOString()}>
							Criada em {formatDate(campaign.createdAt)}
						</time>
					</DialogDescription>
				</DialogHeader>

				<section className="flex flex-col gap-2">
					<h4 className="typography-overline">Público-alvo</h4>
					<p className="text-sm text-zinc-500">
						{CAMPAIGN_KIND_DESCRIPTIONS[campaign.kind]}
					</p>
				</section>

				<section className="flex flex-col gap-2">
					<h4 className="typography-overline">Mensagem enviada</h4>
					<p className="rounded-lg bg-zinc-50 px-4 py-3 text-sm whitespace-pre-wrap text-zinc-700">
						{campaign.message}
					</p>
				</section>

				<section className="flex flex-col gap-2">
					<h4 className="typography-overline">Desempenho</h4>
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
						<Stat
							Icon={Mails}
							label="Notificações"
							value={formatInteger(campaign.notifiedCount)}
						/>
						<Stat
							Icon={Users}
							label="Envios a elegíveis"
							value={formatInteger(campaign.eligibleReached)}
						/>
						<Stat
							Icon={UserCheck}
							label="Confirmações"
							value={formatInteger(campaign.confirmationsCount)}
						/>
						<Stat
							Icon={Target}
							label="Taxa de resposta"
							value={formatPercent(campaign.conversionRate)}
							hint="confirmações ÷ envios"
						/>
					</div>

					<div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 px-3 py-2.5">
						<span className="flex flex-col">
							<span className="text-sm text-zinc-900">
								Precisão do direcionamento
							</span>
							<span className="text-xs text-zinc-400">
								envios que chegaram a quem podia doar
							</span>
						</span>
						<span className="text-lg font-bold tabular-nums text-zinc-900">
							{formatPercent(targetingPrecision)}
						</span>
					</div>
				</section>
			</DialogContent>
		</Dialog>
	)
}
