import { AutoMap } from "@automapper/classes"
import type { BloodTypeEnum } from "../enums/BloodTypeEnum"
import type { CampaignKindEnum } from "../enums/CampaignKindEnum"
import type { CampaignStatusEnum } from "../enums/CampaignStatusEnum"

export class CampaignVM {
	@AutoMap()
	id: string

	@AutoMap()
	title: string

	@AutoMap()
	message: string

	@AutoMap(() => String)
	bloodType: BloodTypeEnum | null

	@AutoMap(() => String)
	kind: CampaignKindEnum

	@AutoMap(() => String)
	status: CampaignStatusEnum

	@AutoMap()
	notifiedCount: number

	@AutoMap()
	eligibleReached: number

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
		bloodType: BloodTypeEnum | null,
		kind: CampaignKindEnum,
		status: CampaignStatusEnum,
		notifiedCount: number,
		eligibleReached: number,
		confirmationsCount: number,
		conversionRate: number,
		createdAt: Date,
	) {
		this.id = id
		this.title = title
		this.message = message
		this.bloodType = bloodType
		this.kind = kind
		this.status = status
		this.notifiedCount = notifiedCount
		this.eligibleReached = eligibleReached
		this.confirmationsCount = confirmationsCount
		this.conversionRate = conversionRate
		this.createdAt = createdAt
	}
}
