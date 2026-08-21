import type { TFactory } from "@/core/Factory"
import { GetBloodBankSummaryQuery } from "@/data/queries/GetBloodBankSummaryQuery"
import type { IGetBloodBankSummaryQuery } from "@/domain/queries/IGetBloodBankSummaryQuery"

export const createGetBloodBankSummaryQuery: TFactory<
	IGetBloodBankSummaryQuery
> = () => {
	return new GetBloodBankSummaryQuery()
}
