export class ManyRequestsError extends Error {
	constructor(err: Error) {
		super(err.message)
	}
}
