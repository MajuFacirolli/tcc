export class ResponseError<T> extends Error {
	public message: string
	public status?: number
	public response: T

	constructor(message: string, response: T, status?: number) {
		super()
		this.message = message
		this.status = status
		this.response = response
	}
}
