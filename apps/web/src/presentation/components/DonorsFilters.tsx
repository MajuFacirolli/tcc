import { BLOOD_TYPES, type BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"
import type { useDonorsFilters } from "../hooks/useDonorsFilters"
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
const ELIGIBLE = "eligible"
const NOT_ELIGIBLE = "not-eligible"

type DonorsFiltersProps = Pick<
	ReturnType<typeof useDonorsFilters>,
	"filters" | "setFilters" | "clearFilters" | "hasFilters"
>

const eligibilityToValue = (isEligible: boolean | null) => {
	if (isEligible === null) return ALL
	return isEligible ? ELIGIBLE : NOT_ELIGIBLE
}

const valueToEligibility = (value: string) => {
	if (value === ALL) return null
	return value === ELIGIBLE
}

export const DonorsFilters = ({
	filters,
	setFilters,
	clearFilters,
	hasFilters,
}: DonorsFiltersProps) => (
	<div className="flex flex-wrap items-end gap-3">
		{/* Bottom-aligned with the controls, not with the labels above them. */}
		<SlidersHorizontal className="mb-2.5 size-4 shrink-0 text-zinc-500" />

		{/* `htmlFor` alone would not name the trigger: it is a button, and a for-associated
		    label does not feed a button's accessible name. `aria-labelledby` points at the
		    visible text, so there is still only one source for it. */}
		<Field className="w-44 gap-1.5">
			<FieldLabel id="donors-blood-type-label" htmlFor="donors-blood-type">
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
					id="donors-blood-type"
					aria-labelledby="donors-blood-type-label"
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
			<FieldLabel id="donors-eligibility-label" htmlFor="donors-eligibility">
				Elegibilidade
			</FieldLabel>
			<Select
				value={eligibilityToValue(filters.isEligible)}
				onValueChange={(value) =>
					setFilters({ isEligible: valueToEligibility(value) })
				}
			>
				<SelectTrigger
					id="donors-eligibility"
					aria-labelledby="donors-eligibility-label"
				>
					<SelectValue placeholder="Todos os doadores" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL}>Todos os doadores</SelectItem>
					<SelectItem value={ELIGIBLE}>Elegíveis</SelectItem>
					<SelectItem value={NOT_ELIGIBLE}>Em intervalo</SelectItem>
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
