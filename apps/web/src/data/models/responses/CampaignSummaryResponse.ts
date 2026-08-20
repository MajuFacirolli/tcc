import type { BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"
import { AutoMap } from "@automapper/classes"

export class CampaignSummaryResponse {
	@AutoMap()
	id: string

	@AutoMap()
	title: string

	@AutoMap(() => String)
	bloodType: BloodTypeEnum

	@AutoMap()
	notifiedCount: number

	@AutoMap()
	conversionRate: number

	constructor(
		id: string,
		title: string,
		bloodType: BloodTypeEnum,
		notifiedCount: number,
		conversionRate: number,
	) {
		this.id = id
		this.title = title
		this.bloodType = bloodType
		this.notifiedCount = notifiedCount
		this.conversionRate = conversionRate
	}
}
