import { AutoMap } from "@automapper/classes"
import type { BloodTypeEnum } from "../enums/BloodTypeEnum"
import type { CampaignKindEnum } from "../enums/CampaignKindEnum"

export class CampaignSummaryVM {
	@AutoMap()
	id: string

	@AutoMap()
	title: string

	@AutoMap(() => String)
	bloodType: BloodTypeEnum | null

	@AutoMap(() => String)
	kind: CampaignKindEnum

	@AutoMap()
	notifiedCount: number

	@AutoMap()
	conversionRate: number

	constructor(
		id: string,
		title: string,
		bloodType: BloodTypeEnum | null,
		kind: CampaignKindEnum,
		notifiedCount: number,
		conversionRate: number,
	) {
		this.id = id
		this.title = title
		this.bloodType = bloodType
		this.kind = kind
		this.notifiedCount = notifiedCount
		this.conversionRate = conversionRate
	}
}
