import { left, right, type TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type { IGetMetricsQuery } from "@/domain/queries/IGetMetricsQuery"
import type { IMetricsVM } from "@/domain/viewmodels/MetricsVM"
import { client } from "../modules/client"
import type { IApiResponse } from "../modules/client/types/IApiResponse"
import type { IMetricsResponse } from "../models/responses/MetricsResponse"
import { parseError } from "@/utils/parseError"

/**
 * Mapped by hand rather than through `mapper`: the payload is several levels deep and
 * automapper/classes would need a decorated class per nested object for no gain. The
 * conversions are the ones the rest of the data layer performs — ISO strings become
 * Dates, and every 0–1 ratio is scaled to a percentage so no component has to.
 */
const percent = (ratio: number) => ratio * 100

function toMetricsVM(response: IMetricsResponse): IMetricsVM {
	return {
		windowDays: response.windowDays,
		range: {
			from: new Date(response.range.from),
			to: new Date(response.range.to),
		},
		headline: {
			...response.headline,
			responseRate: percent(response.headline.responseRate),
			retentionRate: percent(response.headline.retentionRate),
		},
		reach: response.reach,
		retention: {
			...response.retention,
			rate: percent(response.retention.rate),
			reactivationRate: percent(response.retention.reactivationRate),
		},
		responseSpeed: response.responseSpeed.map((point) => ({
			...point,
			share: percent(point.share),
		})),
		byBloodType: response.byBloodType.map((row) => ({
			...row,
			responseRate: percent(row.responseRate),
		})),
		series: response.series.map((bucket) => ({
			bucketStart: new Date(bucket.bucketStart),
			notifications: bucket.notifications,
			intentions: bucket.intentions,
		})),
		campaigns: response.campaigns.map((campaign) => ({
			...campaign,
			createdAt: new Date(campaign.createdAt),
			responseRate: percent(campaign.responseRate),
		})),
	}
}

export class GetMetricsQuery implements IGetMetricsQuery {
	async execute(): Promise<TEither<TApplicationError, IMetricsVM>> {
		try {
			const { data } = await client<IApiResponse<IMetricsResponse>>("/metrics")

			return right(toMetricsVM(data.data))
		} catch (error) {
			return left(parseError(error))
		}
	}
}
