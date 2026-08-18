import { NotFoundError } from "@/core/errors/NotFoundError"
import type { ConfirmationVM } from "@/domain/viewmodels/ConfirmationVM"
import { createConfirmDonationIntentionCommand } from "@/factories/createConfirmDonationIntentionCommand"
import { QUERY_KEYS } from "../data/queryKeys"
import { useFetch } from "./useFetch"

const confirmDonationIntentionCommand = createConfirmDonationIntentionCommand()

export const useConfirmDonationIntention = (token: string) => {
	const { data, isLoading, error } = useFetch<ConfirmationVM>({
		queryKeys: [QUERY_KEYS.CONFIRMATION, token],
		queryFn: async () =>
			await confirmDonationIntentionCommand.execute({ token }),
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnWindowFocus: false,
	})

	return {
		confirmedAt: data?.confirmedAt,
		isLoading,
		isAlreadyConfirmed: !!data?.alreadyConfirmed,
		isInvalidToken: error instanceof NotFoundError,
		hasError: !!error,
	}
}
