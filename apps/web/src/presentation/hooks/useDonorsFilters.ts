import { BLOOD_TYPES, type BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"
import {
	parseAsBoolean,
	parseAsInteger,
	parseAsStringEnum,
	useQueryStates,
} from "nuqs"

const donorsParsers = {
	bloodType: parseAsStringEnum<BloodTypeEnum>([...BLOOD_TYPES]),
	isEligible: parseAsBoolean,
	page: parseAsInteger.withDefault(1),
}

type DonorsFilterUpdates = {
	bloodType?: BloodTypeEnum | null
	isEligible?: boolean | null
	page?: number | null
}

export const useDonorsFilters = () => {
	const [params, setParams] = useQueryStates(donorsParsers, {
		history: "push",
	})

	const setFilters = (updates: DonorsFilterUpdates) => {
		const shouldResetPage = Object.keys(updates).some((key) => key !== "page")

		setParams({ ...updates, ...(shouldResetPage && { page: null }) })
	}

	const clearFilters = () =>
		setParams({ bloodType: null, isEligible: null, page: null })

	return {
		filters: {
			page: params.page,
			bloodType: params.bloodType ?? undefined,
			isEligible: params.isEligible,
		},
		setFilters,
		clearFilters,
		hasFilters: params.bloodType !== null || params.isEligible !== null,
	}
}
