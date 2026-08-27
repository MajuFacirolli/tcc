import type { TFactory } from "@/core/Factory"
import { CountEligibleDonorsQuery } from "@/data/queries/CountEligibleDonorsQuery"
import type { ICountEligibleDonorsQuery } from "@/domain/queries/ICountEligibleDonorsQuery"

export const createCountEligibleDonorsQuery: TFactory<
	ICountEligibleDonorsQuery
> = () => {
	return new CountEligibleDonorsQuery()
}
