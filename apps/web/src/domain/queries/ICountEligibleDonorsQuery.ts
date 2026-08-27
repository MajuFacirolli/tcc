import type { TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type { IQuery } from "@/core/Query"
import type { BloodTypeEnum } from "../enums/BloodTypeEnum"

export interface ICountEligibleDonorsQueryExecuteParams {
	bloodType: BloodTypeEnum
}

export interface ICountEligibleDonorsQuery
	extends IQuery<
		ICountEligibleDonorsQueryExecuteParams,
		TEither<TApplicationError, number>,
		void
	> {}
