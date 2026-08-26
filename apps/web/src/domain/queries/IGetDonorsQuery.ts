import type { TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type { IQuery } from "@/core/Query"
import type { BloodTypeEnum } from "../enums/BloodTypeEnum"
import type { DonorVM } from "../viewmodels/DonorVM"
import type { IPagedList } from "@/core/PagedList"

export interface IGetDonorsQueryExecuteParams {
	page: number
	bloodType?: BloodTypeEnum
	/** `true`/`false` filter by eligibility; `null` returns every donor. */
	isEligible: boolean | null
}

export interface IGetDonorsQuery
	extends IQuery<
		IGetDonorsQueryExecuteParams,
		TEither<TApplicationError, IPagedList<DonorVM>>,
		void
	> {}
