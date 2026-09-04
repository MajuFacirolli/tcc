import { AutoMap } from "@automapper/classes"

export class ProfileResponse {
	@AutoMap()
	id: string

	@AutoMap()
	name: string

	@AutoMap()
	email: string

	constructor(id: string, name: string, email: string) {
		this.id = id
		this.name = name
		this.email = email
	}
}
