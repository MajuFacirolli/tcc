import { AutoMap } from "@automapper/classes"

export class ConfirmationVM {
	@AutoMap()
	confirmedAt: Date

	@AutoMap()
	alreadyConfirmed: boolean

	constructor(confirmedAt: Date, alreadyConfirmed: boolean) {
		this.confirmedAt = confirmedAt
		this.alreadyConfirmed = alreadyConfirmed
	}
}
