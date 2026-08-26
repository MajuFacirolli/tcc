import { BLOOD_TYPES, type BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"
import type { useDonorsFilters } from "../hooks/useDonorsFilters"
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
			value={eligibilityToValue(filters.isEligible)}
			onValueChange={(value) =>
				setFilters({ isEligible: valueToEligibility(value) })
			}
		>
			<SelectTrigger
				aria-label="Elegibilidade"
				className="max-w-44 w-full shrink-0"
			>
				<SelectValue placeholder="Elegibilidade" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={ALL}>Todos os doadores</SelectItem>
				<SelectItem value={ELIGIBLE}>Elegíveis</SelectItem>
				<SelectItem value={NOT_ELIGIBLE}>Em intervalo</SelectItem>
			</SelectContent>
		</Select>

		{hasFilters && (
			<Button variant="ghost" size="sm" onClick={clearFilters}>
				Limpar filtros
			</Button>
		)}
	</div>
)
