import { left, right, type TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type {
	IGetMetricsQuery,
	IGetMetricsQueryExecuteParams,
} from "@/domain/queries/IGetMetricsQuery"
import type {
	IMetricsKindSummaryVM,
	IMetricsVM,
} from "@/domain/viewmodels/MetricsVM"
import { client } from "../modules/client"
import type { IApiResponse } from "../modules/client/types/IApiResponse"
import type {
	IMetricsKindSummaryResponse,
	IMetricsResponse,
} from "../models/responses/MetricsResponse"
import { parseError } from "@/utils/parseError"
import { stringifyQuery } from "@/utils/stringifyQuery"

/**
 * Mapped by hand rather than through `mapper`: the payload is several levels deep
 * and automapper/classes would need a decorated class per nested object for no gain.
 * The conversions are the same ones the campaigns map performs — ISO strings become
 * Dates and the 0–1 conversion ratio is scaled to a percentage.
 */
function toKindSummaryVM(
	kind: IMetricsKindSummaryResponse,
): IMetricsKindSummaryVM {
	return {
		...kind,
		conversionRate: kind.conversionRate * 100,
		eligibleConversionRate: kind.eligibleConversionRate * 100,
		wastedMessageRate: kind.wastedMessageRate * 100,
		targetingPrecision: kind.targetingPrecision * 100,
	}
}

function toMetricsVM(response: IMetricsResponse): IMetricsVM {
	return {
		period: response.period,
		granularity: response.granularity,
		range: {
			from: new Date(response.range.from),
			to: new Date(response.range.to),
		},
		summary: {
			...response.summary,
			conversionRate: response.summary.conversionRate * 100,
			targetingPrecision: response.summary.targetingPrecision * 100,
		},
		series: response.series.map((bucket) => ({
			bucketStart: new Date(bucket.bucketStart),
			notifiedCount: bucket.notifiedCount,
			confirmationsCount: bucket.confirmationsCount,
			averageResponseTime: bucket.averageResponseTime,
		})),
		confirmationsByBloodType: response.confirmationsByBloodType,
		comparison: {
			generic: toKindSummaryVM(response.comparison.generic),
			segmented: toKindSummaryVM(response.comparison.segmented),
			conversionLift: response.comparison.conversionLift,
			// A ratio of rates stays a ratio; a difference of rates becomes points.
			wastedMessageRateReduction:
				response.comparison.wastedMessageRateReduction === null
					? null
					: response.comparison.wastedMessageRateReduction * 100,
			targetingPrecisionGain:
				response.comparison.targetingPrecisionGain === null
					? null
					: response.comparison.targetingPrecisionGain * 100,
		},
	}
}

export class GetMetricsQuery implements IGetMetricsQuery {
	async execute(
		params: IGetMetricsQueryExecuteParams,
	): Promise<TEither<TApplicationError, IMetricsVM>> {
		try {
			const { data } = await client<IApiResponse<IMetricsResponse>>(
				`/metrics?${stringifyQuery(params, { skipNulls: true })}`,
			)

			return right(toMetricsVM(data.data))
		} catch (error) {
			return left(parseError(error))
		}
	}
}
