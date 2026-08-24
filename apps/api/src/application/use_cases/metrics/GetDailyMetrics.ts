import type { GetDailyMetricsOutput } from "@/application/dtos/metrics/GetDailyMetricsOutput"
import type { IMetricsRepository } from "@application/interfaces/IMetricsRepository"
import { addDays, startOfDay } from "@domain/utils/dateUtils"

export class GetDailyMetricsUseCase {
	constructor(private readonly metricsRepository: IMetricsRepository) {}

	/**
	 * `now` is a parameter so the day boundary can be pinned in tests, the same seam
	 * `resolveMetricsWindow` exposes. The window is half-open — `[midnight, next midnight)`
	 * — matching every other metrics window.
	 */
	async execute(now: Date = new Date()): Promise<GetDailyMetricsOutput> {
		const from = startOfDay(now)
		const to = startOfDay(addDays(now, 1))

		return this.metricsRepository.getDailyMetrics({ from, to })
	}
}
