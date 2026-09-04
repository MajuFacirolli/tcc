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
import { Field, FieldLabel } from "./ui/Field"
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
	<div className="flex flex-wrap items-end gap-3">
		{/* Bottom-aligned with the controls, not with the labels above them. */}
		<SlidersHorizontal className="mb-2.5 size-4 shrink-0 text-zinc-500" />

		{/* `htmlFor` alone would not name the trigger: it is a button, and a for-associated
		    label does not feed a button's accessible name. `aria-labelledby` points at the
		    visible text, so there is still only one source for it. */}
		<Field className="w-44 gap-1.5">
			<FieldLabel
				id="campaigns-blood-type-label"
				htmlFor="campaigns-blood-type"
			>
				Tipo sanguíneo
			</FieldLabel>
			<Select
				value={filters.bloodType ?? ALL}
				onValueChange={(value) =>
					setFilters({
						bloodType: value === ALL ? null : (value as BloodTypeEnum),
					})
				}
			>
				<SelectTrigger
					id="campaigns-blood-type"
					aria-labelledby="campaigns-blood-type-label"
				>
					<SelectValue placeholder="Todos os tipos" />
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
		</Field>

		<Field className="w-44 gap-1.5">
			<FieldLabel id="campaigns-kind-label" htmlFor="campaigns-kind">
				Tipo de envio
			</FieldLabel>
			<Select
				value={filters.kind ?? ALL}
				onValueChange={(value) =>
					setFilters({
						kind: value === ALL ? null : (value as CampaignKindEnum),
					})
				}
			>
				<SelectTrigger
					id="campaigns-kind"
					aria-labelledby="campaigns-kind-label"
				>
					<SelectValue placeholder="Todos os envios" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL}>Todos os envios</SelectItem>
					{CAMPAIGN_KINDS.map((kind) => (
						<SelectItem key={kind} value={kind}>
							{CAMPAIGN_KIND_LABELS[kind]}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</Field>

		<Field className="w-44 gap-1.5">
			<FieldLabel id="campaigns-status-label" htmlFor="campaigns-status">
				Status
			</FieldLabel>
			<Select
				value={filters.status ?? ALL}
				onValueChange={(value) =>
					setFilters({
						status: value === ALL ? null : (value as CampaignStatusEnum),
					})
				}
			>
				<SelectTrigger
					id="campaigns-status"
					aria-labelledby="campaigns-status-label"
				>
					<SelectValue placeholder="Todos os status" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL}>Todos os status</SelectItem>
					{CAMPAIGN_STATUSES.map((status) => (
						<SelectItem key={status} value={status}>
							{CAMPAIGN_STATUS_LABELS[status]}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</Field>

		{hasFilters && (
			<Button
				variant="ghost"
				size="sm"
				className="mb-0.5"
				onClick={clearFilters}
			>
				Limpar filtros
			</Button>
		)}
	</div>
)
