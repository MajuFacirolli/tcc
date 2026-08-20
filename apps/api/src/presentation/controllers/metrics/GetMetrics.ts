import type { FastifyReply } from "fastify"
import type { GetMetricsInput } from "@/application/dtos/metrics/GetMetricsInput"
import type { GetMetricsUseCase } from "@application/use_cases/metrics/GetMetrics"
import HttpStatusCode from "@/core/StatusCodesEnum"

export class GetMetricsController {
	constructor(private readonly getMetricsUseCase: GetMetricsUseCase) {}

	async handle(request: { query: GetMetricsInput }, reply: FastifyReply) {
		const metrics = await this.getMetricsUseCase.execute(request.query)
		return reply.status(HttpStatusCode.OK).send({
			data: metrics,
			status: HttpStatusCode.OK,
		})
	}
}
