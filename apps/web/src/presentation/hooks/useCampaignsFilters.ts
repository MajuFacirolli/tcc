import { BLOOD_TYPES, type BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"
import {
	CAMPAIGN_KINDS,
	type CampaignKindEnum,
} from "@/domain/enums/CampaignKindEnum"
import {
	CAMPAIGN_STATUSES,
	type CampaignStatusEnum,
} from "@/domain/enums/CampaignStatusEnum"
import { parseAsInteger, parseAsStringEnum, useQueryStates } from "nuqs"

const campaignsParsers = {
	bloodType: parseAsStringEnum<BloodTypeEnum>([...BLOOD_TYPES]),
	status: parseAsStringEnum<CampaignStatusEnum>([...CAMPAIGN_STATUSES]),
	kind: parseAsStringEnum<CampaignKindEnum>([...CAMPAIGN_KINDS]),
	page: parseAsInteger.withDefault(1),
}

type CampaignsFilterUpdates = {
	bloodType?: BloodTypeEnum | null
	status?: CampaignStatusEnum | null
	kind?: CampaignKindEnum | null
	page?: number | null
}

export const useCampaignsFilters = () => {
	const [params, setParams] = useQueryStates(campaignsParsers, {
		history: "push",
	})

	const setFilters = (updates: CampaignsFilterUpdates) => {
		const shouldResetPage = Object.keys(updates).some((key) => key !== "page")

		setParams({ ...updates, ...(shouldResetPage && { page: null }) })
	}

	const clearFilters = () =>
		setParams({ bloodType: null, status: null, kind: null, page: null })

	return {
		filters: {
			page: params.page,
			bloodType: params.bloodType ?? undefined,
			status: params.status ?? undefined,
			kind: params.kind ?? undefined,
		},
		setFilters,
		clearFilters,
		hasFilters:
			params.bloodType !== null ||
			params.status !== null ||
			params.kind !== null,
	}
}
