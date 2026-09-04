import { createGetCampaignsSummaryQuery } from "@/factories/createGetCampaignsSummaryQuery"
import { useFetch } from "./useFetch"
import { QUERY_KEYS } from "../data/queryKeys"
import { keepPreviousData } from "@tanstack/react-query"

const getCampaignsSummaryQuery = createGetCampaignsSummaryQuery()

export const useCampaignsSummary = () => {
	const { data, error, isLoading, isFetching } = useFetch({
		queryKeys: [QUERY_KEYS.CAMPAIGNS_SUMMARY],
		queryFn: async () => await getCampaignsSummaryQuery.execute(),
		placeholderData: keepPreviousData,
	})

	return {
		campaignsSummary: data,
		error,
		isLoading,
		isFetching,
	}
}
