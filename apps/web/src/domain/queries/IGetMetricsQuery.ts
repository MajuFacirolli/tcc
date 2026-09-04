import type { TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type { IQuery } from "@/core/Query"
import type { MetricsPeriodEnum } from "@/presentation/enums/MetricsPeriodEnum"
import type { IMetricsVM } from "../viewmodels/MetricsVM"

export interface IGetMetricsQueryExecuteParams {
	period: MetricsPeriodEnum
}

export interface IGetMetricsQuery
	extends IQuery<
		IGetMetricsQueryExecuteParams,
		TEither<TApplicationError, IMetricsVM>,
		void
	> {}
