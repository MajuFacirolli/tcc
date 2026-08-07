import type HttpStatusCode from "./StatusCodesEnum"

export class HTTPResponseError<T> extends Error {
	data: T

	status: HttpStatusCode

	constructor(data: T, status: HttpStatusCode) {
		super()
		this.data = data
		this.status = status
	}
}
