import { createGetDonorsQuery } from "@/factories/createGetDonorsQuery"
import { QUERY_KEYS } from "../data/queryKeys"
import { useFetch } from "./useFetch"
import { keepPreviousData } from "@tanstack/react-query"
import type { BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"

const getDonorsQuery = createGetDonorsQuery()

interface IUseDonorsProps {
	page: number
	bloodType?: BloodTypeEnum
	isEligible: boolean | null
}

export const useDonors = (params: IUseDonorsProps) => {
	const { data, isLoading, isFetching, error, refetch } = useFetch({
		queryKeys: [QUERY_KEYS.DONORS, params],
		queryFn: async () => await getDonorsQuery.execute(params),
		placeholderData: keepPreviousData,
	})

	return {
		donors: data?.items,
		total: data?.total ?? 0,
		page: data?.page ?? params.page,
		lastPage: data?.lastPage ?? 1,
		isLoading,
		isFetching,
		error,
		refetch,
	}
}
