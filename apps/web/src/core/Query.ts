export interface IQuery<ExParams, Response, UpParams> {
	execute: (params: ExParams) => Promise<Response>
	update?: (params: UpParams) => Promise<void>
}
