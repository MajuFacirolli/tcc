import { AutoMap } from "@automapper/classes"
import type { BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"
import type { CampaignStatusEnum } from "@/domain/enums/CampaignStatusEnum"

export class CampaignResponse {
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
	createdAt: string

	constructor(
		id: string,
		title: string,
		message: string,
		bloodType: BloodTypeEnum,
		status: CampaignStatusEnum,
		notifiedCount: number,
		confirmationsCount: number,
		conversionRate: number,
		createdAt: string,
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
