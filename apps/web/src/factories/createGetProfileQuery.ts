import type { TFactory } from "@/core/Factory"
import { GetProfileQuery } from "@/data/queries/GetProfileQuery"
import type { IGetProfileQuery } from "@/domain/queries/IGetProfileQuery"

export const createGetProfileQuery: TFactory<IGetProfileQuery> = () => {
	return new GetProfileQuery()
}
