import type { TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import {
	type QueryKey,
	type UseQueryOptions,
	useQuery,
} from "@tanstack/react-query"

type FetchType<TData, TError> = {
	queryKeys: QueryKey
	queryFn: () => Promise<TEither<TApplicationError, TData>>
	enabled?: boolean
	staleTime?: UseQueryOptions<TData, TError>["staleTime"]
	refetchOnWindowFocus?: UseQueryOptions<TData, TError>["refetchOnWindowFocus"]
	placeholderData?: UseQueryOptions<TData, TError>["placeholderData"]
}

export const useFetch = <TData, TError = TApplicationError>({
	queryKeys,
	queryFn,
	enabled,
	staleTime,
	refetchOnWindowFocus,
	placeholderData,
}: FetchType<TData, TError>) =>
	useQuery<TData, TError>({
		enabled,
		staleTime,
		refetchOnWindowFocus,
		placeholderData,
		queryKey: queryKeys,
		queryFn: async () => {
			const response = await queryFn()

			if (response.isLeft()) {
				throw response.value as TApplicationError
			}

			return response.value
		},
	})
