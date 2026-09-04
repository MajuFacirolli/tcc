import { AutoMap } from "@automapper/classes"

export class ConfirmationResponse {
	@AutoMap()
	confirmedAt: string

	@AutoMap()
	alreadyConfirmed: boolean

	constructor(confirmedAt: string, alreadyConfirmed: boolean) {
		this.confirmedAt = confirmedAt
		this.alreadyConfirmed = alreadyConfirmed
	}
}
