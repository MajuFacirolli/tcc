import type HttpStatusCode from "./StatusCodesEnum"

export interface IApiResponse<Body> {
	status: HttpStatusCode
	data: Body
}
