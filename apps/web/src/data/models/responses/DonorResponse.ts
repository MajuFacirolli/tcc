import { AutoMap } from "@automapper/classes"
import type { BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"
import type { SexEnum } from "@/domain/enums/SexEnum"

export class DonorResponse {
	@AutoMap()
	id: string

	@AutoMap()
	name: string

	@AutoMap()
	email: string

	@AutoMap(() => String)
	sex: SexEnum

	@AutoMap(() => String)
	bloodType: BloodTypeEnum

	@AutoMap(() => String)
	lastDonationDate: string | null

	@AutoMap()
	isEligible: boolean

	constructor(
		id: string,
		name: string,
		email: string,
		sex: SexEnum,
		bloodType: BloodTypeEnum,
		lastDonationDate: string | null,
		isEligible: boolean,
	) {
		this.id = id
		this.name = name
		this.email = email
		this.sex = sex
		this.bloodType = bloodType
		this.lastDonationDate = lastDonationDate
		this.isEligible = isEligible
	}
}
