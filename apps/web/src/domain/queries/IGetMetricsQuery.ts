import type { TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type { IQuery } from "@/core/Query"
import type { IMetricsVM } from "../viewmodels/MetricsVM"

/** The window is fixed at the last 30 days, so the query takes no parameters. */
export interface IGetMetricsQuery
	extends IQuery<void, TEither<TApplicationError, IMetricsVM>, void> {}
