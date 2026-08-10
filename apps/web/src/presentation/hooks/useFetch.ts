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
	placeholderData?: UseQueryOptions<TData, TError>["placeholderData"]
}

export const useFetch = <TData, TError = TApplicationError>({
	queryKeys,
	queryFn,
	enabled,
	placeholderData,
}: FetchType<TData, TError>) =>
	useQuery<TData, TError>({
		enabled,
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
