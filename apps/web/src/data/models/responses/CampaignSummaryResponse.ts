import type { BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"
import type { CampaignKindEnum } from "@/domain/enums/CampaignKindEnum"
import { AutoMap } from "@automapper/classes"

export class CampaignSummaryResponse {
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
