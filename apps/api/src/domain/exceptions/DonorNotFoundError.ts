export class DonorNotFoundError extends Error {
	readonly code = "DONOR_NOT_FOUND"
	constructor(id: string) {
		super(`Donor with id "${id}" was not found`)
		this.name = "DonorNotFoundError"
	}
}
