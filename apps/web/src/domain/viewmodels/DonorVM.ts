import { AutoMap } from "@automapper/classes"
import type { BloodTypeEnum } from "../enums/BloodTypeEnum"
import type { SexEnum } from "../enums/SexEnum"

export class DonorVM {
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

	@AutoMap(() => Date)
	lastDonationDate: Date | null

	@AutoMap()
	isEligible: boolean

	constructor(
		id: string,
		name: string,
		email: string,
		sex: SexEnum,
		bloodType: BloodTypeEnum,
		lastDonationDate: Date | null,
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
