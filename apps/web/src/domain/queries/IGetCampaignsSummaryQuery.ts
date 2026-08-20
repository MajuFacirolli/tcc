import type { TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type { IQuery } from "@/core/Query"
import type { CampaignSummaryVM } from "../viewmodels/CampaignSummaryVM"

export interface IGetCampaignsSummaryQuery
	extends IQuery<void, TEither<TApplicationError, CampaignSummaryVM[]>, void> {}
