import { ERROR_STATUS_CODES } from "./errorStatusCodes"
import type { HttpMethodsEnum } from "./types/HttpMethodsEnum"
import { HTTPResponseError } from "./types/HttpResponseError"
import HttpStatusCode from "./types/StatusCodesEnum"

type TCustomHeaders = Record<string, string>

type THTTPClientCustomOptions = Omit<RequestInit, "headers" | "method"> & {
	headers?: TCustomHeaders
	parseJSON?: boolean
	method?: HttpMethodsEnum
	baseUrl?: string
}

type THTTPClientExecutionReturn<T> = {
	data: T
	status: HttpStatusCode
}

const BASE_URL = import.meta.env?.VITE_API_URL ?? ""

const DEFAULT_HEADERS = { "Content-Type": "application/json" }

const DEFAULT_OPTIONS: THTTPClientCustomOptions = {
	parseJSON: true,
}

function forgeUrl(path: string, baseUrl?: string): string {
	if (baseUrl) return `${baseUrl}${path}`
	return `${BASE_URL}${path}`
}

function mountHeader(customHeader: TCustomHeaders = {}, hasBody = true) {
	const headers = new Headers(
		Object.entries({ ...(hasBody ? DEFAULT_HEADERS : {}), ...customHeader }),
	)

	if (headers.get("Content-Type") === "multipart/form-data") {
		headers.delete("Content-Type")
		return headers
	}

	return headers
}

async function parseResponse<T>(
	response: Response,
	parseJSON = true,
): Promise<T> {
	if (response.status === HttpStatusCode.NO_CONTENT) {
		return {} as T
	}

	if (!parseJSON) {
		if (ERROR_STATUS_CODES.includes(response.status)) {
			throw new HTTPResponseError(null, response.status)
		}

		return response as T
	}

	const bodyContent = await response.text()

	const parsedBody: T = bodyContent ? await JSON.parse(bodyContent) : {}

	if (ERROR_STATUS_CODES.includes(response.status)) {
		throw new HTTPResponseError(parsedBody, response.status)
	}

	return parsedBody
}

export async function client<T>(
	url: string,
	options?: THTTPClientCustomOptions,
): Promise<THTTPClientExecutionReturn<T>> {
	const { parseJSON, ...mergedOptions } = { ...DEFAULT_OPTIONS, ...options }

	const headers = mountHeader(
		mergedOptions.headers,
		mergedOptions.body !== undefined && mergedOptions.body !== null,
	)

	const response = await fetch(forgeUrl(url, mergedOptions?.baseUrl), {
		credentials: "include",
		...mergedOptions,
		headers,
	})

	const parsedResponse = await parseResponse<T>(response, parseJSON)

	return { data: parsedResponse, status: response.status }
}
