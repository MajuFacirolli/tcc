import HttpStatusCode from "./types/StatusCodesEnum"

export const ERROR_STATUS_CODES = [
	HttpStatusCode.BAD_REQUEST,
	HttpStatusCode.UNAUTHORIZED,
	HttpStatusCode.FORBIDDEN,
	HttpStatusCode.NOT_FOUND,
	HttpStatusCode.METHOD_NOT_ALLOWED,
	HttpStatusCode.NOT_ACCEPTABLE,
	HttpStatusCode.CONFLICT,
	HttpStatusCode.UNPROCESSABLE_ENTITY,
	HttpStatusCode.TOO_MANY_REQUESTS,
	HttpStatusCode.INTERNAL_SERVER_ERROR,
]
