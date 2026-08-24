import type { TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type { IQuery } from "@/core/Query"
import type { DailyMetricsVM } from "../viewmodels/DailyMetricsVM"

export interface IGetDailyMetricsQuery
	extends IQuery<void, TEither<TApplicationError, DailyMetricsVM>, void> {}
