import { BLOOD_TYPES, type BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"
import {
	CAMPAIGN_KINDS,
	type CampaignKindEnum,
} from "@/domain/enums/CampaignKindEnum"
import {
	CAMPAIGN_STATUSES,
	type CampaignStatusEnum,
} from "@/domain/enums/CampaignStatusEnum"
import { CAMPAIGN_KIND_LABELS } from "../data/campaignKindLabels"
import { CAMPAIGN_STATUS_LABELS } from "../data/campaignStatusLabels"
import type { useCampaignsFilters } from "../hooks/useCampaignsFilters"
import { Button } from "./ui/Button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/Select"
import { SlidersHorizontal } from "lucide-react"

const ALL = "all"

type CampaignsFiltersProps = Pick<
	ReturnType<typeof useCampaignsFilters>,
	"filters" | "setFilters" | "clearFilters" | "hasFilters"
>

export const CampaignsFilters = ({
	filters,
	setFilters,
	clearFilters,
	hasFilters,
}: CampaignsFiltersProps) => (
	<div className="flex items-center gap-2">
		<SlidersHorizontal className="size-4 shrink-0" />
		<Select
			value={filters.bloodType ?? ALL}
			onValueChange={(value) =>
				setFilters({
					bloodType: value === ALL ? null : (value as BloodTypeEnum),
				})
			}
		>
			<SelectTrigger
				aria-label="Tipo sanguíneo"
				className="max-w-44 w-full shrink-0"
			>
				<SelectValue placeholder="Tipo sanguíneo" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={ALL}>Todos os tipos</SelectItem>
				{BLOOD_TYPES.map((bloodType) => (
					<SelectItem key={bloodType} value={bloodType}>
						{bloodType}
					</SelectItem>
				))}
			</SelectContent>
		</Select>

		<Select
			value={filters.kind ?? ALL}
			onValueChange={(value) =>
				setFilters({
					kind: value === ALL ? null : (value as CampaignKindEnum),
				})
			}
		>
			<SelectTrigger
				aria-label="Tipo de campanha"
				className="max-w-44 w-full shrink-0"
			>
				<SelectValue placeholder="Tipo de campanha" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={ALL}>Todos os tipos de envio</SelectItem>
				{CAMPAIGN_KINDS.map((kind) => (
					<SelectItem key={kind} value={kind}>
						{CAMPAIGN_KIND_LABELS[kind]}
					</SelectItem>
				))}
			</SelectContent>
		</Select>

		<Select
			value={filters.status ?? ALL}
			onValueChange={(value) =>
				setFilters({
					status: value === ALL ? null : (value as CampaignStatusEnum),
				})
			}
		>
			<SelectTrigger aria-label="Status" className="max-w-44 w-full shrink-0">
				<SelectValue placeholder="Status" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={ALL}>Todas os status</SelectItem>
				{CAMPAIGN_STATUSES.map((status) => (
					<SelectItem key={status} value={status}>
						{CAMPAIGN_STATUS_LABELS[status]}
					</SelectItem>
				))}
			</SelectContent>
		</Select>

		{hasFilters && (
			<Button variant="ghost" size="sm" onClick={clearFilters}>
				Limpar filtros
			</Button>
		)}
	</div>
)
