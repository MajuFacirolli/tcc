import { createGetCampaignsQuery } from "@/factories/createGetCampaignsQuery"
import { QUERY_KEYS } from "../data/queryKeys"
import { useFetch } from "./useFetch"
import { keepPreviousData } from "@tanstack/react-query"
import type { BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"
import type { CampaignStatusEnum } from "@/domain/enums/CampaignStatusEnum"

const getCampaignsQuery = createGetCampaignsQuery()

interface IUseCampaignsProps {
	page: number
	bloodType?: BloodTypeEnum
	status?: CampaignStatusEnum
}

export const useCampaigns = (params: IUseCampaignsProps) => {
	const { data, isLoading, isFetching, error, refetch } = useFetch({
		queryKeys: [QUERY_KEYS.CAMPAIGNS, params],
		queryFn: async () => await getCampaignsQuery.execute(params),
		placeholderData: keepPreviousData,
	})

	return {
		campaigns: data?.items,
		page: data?.page ?? params.page,
		lastPage: data?.lastPage ?? 1,
		isLoading,
		isFetching,
		error,
		refetch,
	}
}
