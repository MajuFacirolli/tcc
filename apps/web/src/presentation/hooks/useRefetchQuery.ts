import { useQueryClient } from "@tanstack/react-query"

export const useRefetchQuery = () => {
	const queryClient = useQueryClient()

	function refetchQuery(queryKeys: string[]) {
		return queryClient.invalidateQueries({ queryKey: queryKeys })
	}

	return refetchQuery
}
