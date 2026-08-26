import type { TFactory } from "@/core/Factory"
import { GetDonorsQuery } from "@/data/queries/GetDonorsQuery"
import type { IGetDonorsQuery } from "@/domain/queries/IGetDonorsQuery"

export const createGetDonorsQuery: TFactory<IGetDonorsQuery> = () => {
	return new GetDonorsQuery()
}
