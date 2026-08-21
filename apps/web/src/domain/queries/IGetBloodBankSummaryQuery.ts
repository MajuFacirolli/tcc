import type { TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type { IQuery } from "@/core/Query"
import type { BloodBankSummaryVM } from "../viewmodels/BloodBankSummaryVM"

export interface IGetBloodBankSummaryQuery
	extends IQuery<
		void,
		TEither<TApplicationError, Array<BloodBankSummaryVM>>,
		void
	> {}
