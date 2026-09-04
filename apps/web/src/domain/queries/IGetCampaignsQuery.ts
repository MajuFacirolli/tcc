import type { TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type { IQuery } from "@/core/Query"
import type { BloodTypeEnum } from "../enums/BloodTypeEnum"
import type { CampaignKindEnum } from "../enums/CampaignKindEnum"
import type { CampaignStatusEnum } from "../enums/CampaignStatusEnum"
import type { CampaignVM } from "../viewmodels/CampaignVM"
import type { IPagedList } from "@/core/PagedList"

export interface IGetCampaignsQueryExecuteParams {
	page: number
	bloodType?: BloodTypeEnum
	status?: CampaignStatusEnum
	kind?: CampaignKindEnum
}

export interface IGetCampaignsQuery
	extends IQuery<
		IGetCampaignsQueryExecuteParams,
		TEither<TApplicationError, IPagedList<CampaignVM>>,
		void
	> {}
