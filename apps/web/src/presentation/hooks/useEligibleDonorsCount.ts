import { createCountEligibleDonorsQuery } from "@/factories/createCountEligibleDonorsQuery"
import type { BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"
import { QUERY_KEYS } from "../data/queryKeys"
import { useFetch } from "./useFetch"

const countEligibleDonorsQuery = createCountEligibleDonorsQuery()

interface IUseEligibleDonorsCountProps {
	bloodType?: BloodTypeEnum
}

export const useEligibleDonorsCount = ({
	bloodType,
}: IUseEligibleDonorsCountProps) => {
	const { data, isLoading, isFetching, error } = useFetch({
		queryKeys: [QUERY_KEYS.ELIGIBLE_DONORS_COUNT, bloodType],
		queryFn: async () =>
			await countEligibleDonorsQuery.execute({
				bloodType: bloodType as BloodTypeEnum,
			}),
		enabled: !!bloodType,
	})

	return {
		eligibleDonorsCount: bloodType ? data : undefined,
		isLoading,
		isFetching,
		error,
	}
}
