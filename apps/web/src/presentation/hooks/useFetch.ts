import type { TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import { type QueryKey, useQuery } from "@tanstack/react-query"

type FetchType<TData> = {
	queryKeys: QueryKey
	queryFn: () => Promise<TEither<TApplicationError, TData>>
	enabled?: boolean
}

export const useFetch = <TData, TError = TApplicationError>({
	queryKeys,
	queryFn,
	enabled,
}: FetchType<TData>) =>
	useQuery<TData, TError>({
		enabled,
		queryKey: queryKeys,
		queryFn: async () => {
			const response = await queryFn()

			if (response.isLeft()) {
				throw response.value as TApplicationError
			}

			return response.value
		},
	})
