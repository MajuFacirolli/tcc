import { queryOptions } from "@tanstack/react-query"
import { createGetProfileQuery } from "@/factories/createGetProfileQuery"
import { QUERY_KEYS } from "../data/queryKeys"

const getProfileQuery = createGetProfileQuery()

export const profileQueryOptions = queryOptions({
	queryKey: [QUERY_KEYS.PROFILE],
	queryFn: async () => {
		const response = await getProfileQuery.execute()

		if (response.isLeft()) throw response.value

		return response.value
	},
	// Route guards await this one, so a 401 has to fail fast instead of
	// running through the default retries before the redirect happens.
	retry: false,
	staleTime: 5 * 60 * 1000,
})
