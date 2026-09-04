import { describe, expect, it, vi } from "vitest"
import { GetMetricsUseCase } from "@application/use_cases/metrics/GetMetrics"
import type { IMetricsRepository } from "@application/interfaces/IMetricsRepository"
import { RESPONSE_SPEED_HOURS } from "@domain/utils/metricsWindow"

const TOTALS = {
	notifications: 1000,
	intentions: 200,
	averageResponseTime: 21600,
}

const RETENTION = {
	answeredThenNotified: 100,
	answeredAgain: 20,
	ignoredThenNotified: 800,
	reactivated: 80,
}

function buildUseCase(overrides: Partial<IMetricsRepository> = {}) {
	const repository: IMetricsRepository = {
		countEligibleDonors: vi.fn().mockResolvedValue(600),
		getTotals: vi.fn().mockResolvedValue(TOTALS),
		getReach: vi.fn().mockResolvedValue({
			donorsReached: 500,
			respondingDonors: 150,
			repeatResponders: 40,
		}),
		getRetention: vi.fn().mockResolvedValue(RETENTION),
		getResponseSpeed: vi
			.fn()
			.mockResolvedValue([{ hours: 6, intentions: 120 }]),
		getByBloodType: vi.fn().mockResolvedValue([]),
		getBuckets: vi.fn().mockResolvedValue([]),
		getCampaigns: vi.fn().mockResolvedValue([]),
		getDailyMetrics: vi.fn(),
		...overrides,
	}

	return new GetMetricsUseCase(repository)
}

describe("GetMetricsUseCase headline", () => {
	it("divides intentions by the notifications that produced them", async () => {
		const { headline } = await buildUseCase().execute()

		expect(headline.responseRate).toBeCloseTo(0.2)
		expect(headline.intentions).toBe(200)
		expect(headline.averageResponseTime).toBe(21600)
	})

	it("reports no response time when nothing was answered", async () => {
		const { headline } = await buildUseCase({
			getTotals: vi.fn().mockResolvedValue({
				notifications: 10,
				intentions: 0,
				averageResponseTime: null,
			}),
		}).execute()

		expect(headline.averageResponseTime).toBe(0)
		expect(headline.responseRate).toBe(0)
	})
})

describe("GetMetricsUseCase retention", () => {
	/** Retention and reactivation share a shape but never a denominator. */
	it("rates each prior outcome against its own population", async () => {
		const { retention, headline } = await buildUseCase().execute()

		expect(retention.rate).toBeCloseTo(0.2)
		expect(retention.reactivationRate).toBeCloseTo(0.1)
		expect(headline.retentionRate).toBe(retention.rate)
	})

	it("stays at zero when nobody was asked twice", async () => {
		const { retention } = await buildUseCase({
			getRetention: vi.fn().mockResolvedValue({
				answeredThenNotified: 0,
				answeredAgain: 0,
				ignoredThenNotified: 0,
				reactivated: 0,
			}),
		}).execute()

		expect(retention.rate).toBe(0)
		expect(retention.reactivationRate).toBe(0)
	})
})

describe("GetMetricsUseCase response speed", () => {
	it("states each cut-off as a share of everything answered", async () => {
		const { responseSpeed } = await buildUseCase().execute()

		expect(responseSpeed[0].share).toBeCloseTo(0.6)
	})

	it("asks the repository for the configured cut-offs", async () => {
		const getResponseSpeed = vi.fn().mockResolvedValue([])
		await buildUseCase({ getResponseSpeed }).execute()

		expect(getResponseSpeed).toHaveBeenCalledWith(
			expect.anything(),
			RESPONSE_SPEED_HOURS,
		)
	})
})

describe("GetMetricsUseCase blood types", () => {
	/** The shortest type is the one that needs a campaign, so it reads first. */
	it("orders by how far the stock sits below its minimum", async () => {
		const { byBloodType } = await buildUseCase({
			getByBloodType: vi.fn().mockResolvedValue([
				{
					bloodType: "A+",
					notifications: 100,
					intentions: 10,
					bagsCount: 2400,
					minThreshold: 1250,
				},
				{
					bloodType: "O-",
					notifications: 50,
					intentions: 10,
					bagsCount: 430,
					minThreshold: 1250,
				},
			]),
		}).execute()

		expect(byBloodType.map((row) => row.bloodType)).toEqual(["O-", "A+"])
		expect(byBloodType[0].stockBalance).toBe(-820)
		expect(byBloodType[0].responseRate).toBeCloseTo(0.2)
		expect(byBloodType[1].stockBalance).toBe(1150)
	})
})
