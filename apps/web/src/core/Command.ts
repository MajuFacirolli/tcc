export interface ICommand<ExParams, Response> {
	execute: (params: ExParams) => Promise<Response>
}
