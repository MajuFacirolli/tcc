import type { FastifyReply } from "fastify"
import type { GetMetricsUseCase } from "@application/use_cases/metrics/GetMetrics"
import HttpStatusCode from "@/core/StatusCodesEnum"

export class GetMetricsController {
	constructor(private readonly getMetricsUseCase: GetMetricsUseCase) {}

	async handle(reply: FastifyReply) {
		const metrics = await this.getMetricsUseCase.execute()
		return reply.status(HttpStatusCode.OK).send({
			data: metrics,
			status: HttpStatusCode.OK,
		})
	}
}
