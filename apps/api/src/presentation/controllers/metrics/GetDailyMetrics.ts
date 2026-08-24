import type { GetDailyMetricsUseCase } from "@/application/use_cases/metrics/GetDailyMetrics"
import HttpStatusCode from "@/core/StatusCodesEnum"
import type { FastifyReply, FastifyRequest } from "fastify"

export class GetDailyMetricsController {
	constructor(
		private readonly getDailyMetricsUseCase: GetDailyMetricsUseCase,
	) {}

	async handle(_request: FastifyRequest, reply: FastifyReply) {
		const data = await this.getDailyMetricsUseCase.execute()

		return reply.status(HttpStatusCode.OK).send({
			data,
			status: HttpStatusCode.OK,
		})
	}
}
