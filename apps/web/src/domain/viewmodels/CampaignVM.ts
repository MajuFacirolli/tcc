import { AutoMap } from "@automapper/classes"
import type { BloodTypeEnum } from "../enums/BloodTypeEnum"
import type { CampaignStatusEnum } from "../enums/CampaignStatusEnum"

export class CampaignVM {
	@AutoMap()
	id: string

	@AutoMap()
	title: string

	@AutoMap()
	message: string

	@AutoMap(() => String)
	bloodType: BloodTypeEnum

	@AutoMap(() => String)
	status: CampaignStatusEnum

	@AutoMap()
	notifiedCount: number

	@AutoMap()
	confirmationsCount: number

	@AutoMap()
	conversionRate: number

	@AutoMap()
	createdAt: Date

	constructor(
		id: string,
		title: string,
		message: string,
		bloodType: BloodTypeEnum,
		status: CampaignStatusEnum,
		notifiedCount: number,
		confirmationsCount: number,
		conversionRate: number,
		createdAt: Date,
	) {
		this.id = id
		this.title = title
		this.message = message
		this.bloodType = bloodType
		this.status = status
		this.notifiedCount = notifiedCount
		this.confirmationsCount = confirmationsCount
		this.conversionRate = conversionRate
		this.createdAt = createdAt
	}
}
