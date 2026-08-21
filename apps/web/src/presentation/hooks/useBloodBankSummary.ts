import { createGetBloodBankSummaryQuery } from "@/factories/createGetBloodBankSummaryQuery"
import { useFetch } from "./useFetch"
import { QUERY_KEYS } from "../data/queryKeys"
import type { BloodBankSummaryVM } from "@/domain/viewmodels/BloodBankSummaryVM"
import { keepPreviousData } from "@tanstack/react-query"

const getBloodBankSummaryQuery = createGetBloodBankSummaryQuery()

export const useBloodBankSummary = () => {
	const { data, error, isLoading, isFetching } = useFetch<
		Array<BloodBankSummaryVM>
	>({
		queryKeys: [QUERY_KEYS.BLOOD_BANK_SUMMARY],
		queryFn: async () => await getBloodBankSummaryQuery.execute(),
		placeholderData: keepPreviousData,
	})

	return {
		bloodBankSummary: data,
		error,
		isLoading,
		isFetching,
	}
}
