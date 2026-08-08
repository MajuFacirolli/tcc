import type { TApplicationError } from "@/core/errors/ApplicationError"
import { ForbiddenError } from "@/core/errors/ForbiddenError"
import { GenericError } from "@/core/errors/GenericError"
import { LockedError } from "@/core/errors/LockedError"
import { ManyRequestsError } from "@/core/errors/ManyRequestsError"
import { MapperError } from "@/core/errors/MapperError"
import { NotAcceptableError } from "@/core/errors/NotAcceptable"
import { NotFoundError } from "@/core/errors/NotFoundError"
import { ServerError } from "@/core/errors/ServerError"
import { UnauthorizedError } from "@/core/errors/UnauthorizedError"
import { ValidationError } from "@/core/errors/ValidationError"
import { HTTPResponseError } from "@/data/modules/client/types/HttpResponseError"
import HttpStatusCode from "@/data/modules/client/types/StatusCodesEnum"
import { flattenObject } from "@/utils/flattenObject"
import { toCamelCase } from "@/utils/toCamelCase"

interface FieldMap {
	[key: string]: string
}

interface HttpResponseErrorPayload {
	message?: string
	status?: number
	statusCode?: number
	data?: null
	errors?: Record<string, unknown>
}

const SHOW_ERROR = import.meta.env.VITE_SHOW_DEBUG_ERRORS === "true"

function isIndex(prop: string): boolean {
	return !Number.isNaN(Number(prop))
}

function isError(value: unknown): value is Error {
	return value instanceof Error
}

function isHttpResponseError<T>(value: unknown): value is HTTPResponseError<T> {
	return value instanceof HTTPResponseError
}

function getPropName(
	prop: string,
	fieldMap: FieldMap,
	isRoot: boolean,
): string {
	const propertyName = isIndex(prop)
		? prop
		: (fieldMap[prop] ?? toCamelCase(prop))

	return isRoot ? propertyName : `.${propertyName}`
}

function composeProps(properties: string[], fieldMap: FieldMap): string {
	return properties
		.map((prop, index) => getPropName(prop, fieldMap, index === 0))
		.join("")
}

function formatProp(property: string, fieldMap: FieldMap): string {
	const mappedProperty = fieldMap[property]

	if (!mappedProperty) return property

	if (property.includes(".") && fieldMap[property]?.includes(".")) {
		const splittedProperty = property.split(".")

		if (splittedProperty.length === 0) return property

		return composeProps(splittedProperty, fieldMap)
	}

	return mappedProperty
}

function validate(
	data: HttpResponseErrorPayload,
	fallbackMessage: string,
	fieldMap?: FieldMap,
): TApplicationError {
	if (data.errors === undefined) {
		return new GenericError({
			name: "GenericError",
			message: `A validation error found, but no parameters provided | Original message:\n${data.message ?? fallbackMessage}`,
		})
	}

	return new ValidationError(
		Object.entries(flattenObject(data.errors)).map((err) => {
			const parameter = fieldMap ? formatProp(err[0], fieldMap) : err[0]

			return {
				parameter,
				error: Array.isArray(err[1]) ? String(err[1][0]) : String(err[1]),
			}
		}),
	)
}

export function parseError(
	error: unknown,
	fieldMap?: FieldMap,
): TApplicationError {
	if (SHOW_ERROR) {
		console.error(error)
	}

	if (error instanceof MapperError) {
		return error
	}

	if (!isHttpResponseError<HttpResponseErrorPayload>(error)) {
		const message = isError(error) ? error.message : "An error occurred"

		return new GenericError({
			name: "GenericError",
			message,
		})
	}

	const { status, data } = error

	const message = data?.message ?? error.message ?? "An error occurred"
	const responseError = new Error(message)

	if (status === HttpStatusCode.UNAUTHORIZED) {
		return new UnauthorizedError(responseError)
	}

	if (status === HttpStatusCode.FORBIDDEN) {
		return new ForbiddenError(responseError)
	}

	if (status === HttpStatusCode.NOT_FOUND) {
		return new NotFoundError(responseError)
	}

	if (status === HttpStatusCode.NOT_ACCEPTABLE) {
		return new NotAcceptableError(responseError)
	}

	if (status === HttpStatusCode.LOCKED) {
		return new LockedError(responseError)
	}

	if (
		status === HttpStatusCode.BAD_REQUEST ||
		status === HttpStatusCode.UNPROCESSABLE_ENTITY
	) {
		return validate(data ?? {}, message, fieldMap)
	}

	if (status === HttpStatusCode.TOO_MANY_REQUESTS) {
		return new ManyRequestsError(responseError)
	}

	if (status === HttpStatusCode.INTERNAL_SERVER_ERROR) {
		return new ServerError(responseError)
	}

	return new GenericError(responseError)
}
