import type { BloodBankStatus } from "@domain/value_objects/BloodBankStatus"
import type { BloodType } from "@domain/value_objects/BloodType"
import { createSeededRandom } from "@domain/utils/random"
import { SIMULATION_CONFIG } from "./simulationConfig"

/**
 * The conditions a simulated donor reacts to. Every field is a fact the system
 * already holds at the moment a campaign e-mail goes out.
 */
export interface DonationIntentionInput {
	campaignId: string
	donorId: string
	donorBloodType: BloodType
	campaignBloodType: BloodType
	donorIsEligible: boolean
	stockStatus: BloodBankStatus
}

export interface DonationIntentionOutcome {
	probability: number
	willConfirm: boolean
	/** `null` whenever no intention is manifested — there is no response to time. */
	responseDelaySeconds: number | null
}

/** Names a draw, so two questions about one donor never share a stream. */
const DRAW = {
	PROPENSITY: "propensity",
	INTENTION: "intention",
	DELAY: "delay",
} as const

/**
 * The donor's standing predisposition to answer a campaign, in log-odds.
 *
 * Derived from the id rather than stored: `donors` has no column for it, the value
 * would be pure derived state if it did, and hashing the id gives the same answer on
 * every run without a migration. Two donors with identical characteristics get
 * different values; the same donor gets one value, forever.
 *
 * Mapped to `[-propensitySpread, +propensitySpread]` — symmetric, so propensity
 * shifts individuals around the population's behaviour without shifting the
 * population itself.
 */
export function donorPropensity(donorId: string): number {
	const draw = createSeededRandom(
		SIMULATION_CONFIG.seed,
		DRAW.PROPENSITY,
		donorId,
	)()

	return (draw - 0.5) * 2 * SIMULATION_CONFIG.propensitySpread
}

/**
 * The logistic model:
 *
 *   score = intercept + bloodTypeMatch + eligibility + urgency + propensity
 *   probability = 1 / (1 + e^-score)
 *
 * Always returns the full curve, including for ineligible donors. The hard rule that
 * an ineligible donor cannot confirm lives in `simulateDonationIntention`, not here,
 * so that the weights stay comparable — a probability that collapsed to zero would
 * make the model impossible to inspect one factor at a time.
 */
export function calculateIntentionProbability(
	input: DonationIntentionInput,
): number {
	const matchesBloodType = input.donorBloodType === input.campaignBloodType

	const score =
		SIMULATION_CONFIG.intercept +
		(matchesBloodType ? SIMULATION_CONFIG.bloodTypeMatchWeight : 0) +
		(input.donorIsEligible ? SIMULATION_CONFIG.eligibleWeight : 0) +
		SIMULATION_CONFIG.urgencyWeights[input.stockStatus] +
		donorPropensity(input.donorId)

	return 1 / (1 + Math.exp(-score))
}

/**
 * How long the donor takes to answer, in simulated seconds.
 *
 * A shifted exponential: most responses cluster in the first hours, with a thinning
 * tail of stragglers. Uniform delays would put the same number of answers in every
 * hour, which is neither how people read e-mail nor a shape worth charting.
 *
 * Truncated rather than resampled at the ceiling, so the draw always terminates.
 */
export function sampleResponseDelaySeconds(random: () => number): number {
	const uniform = random()

	// `1 - uniform` keeps the log's argument off zero: mulberry32 can return exactly
	// 0, and -log(0) is Infinity.
	const tail =
		-Math.log(1 - uniform) * SIMULATION_CONFIG.meanResponseDelaySeconds

	return Math.min(
		SIMULATION_CONFIG.minResponseDelaySeconds + tail,
		SIMULATION_CONFIG.maxResponseDelaySeconds,
	)
}

/**
 * Decides whether one notified donor manifests intention, and when.
 *
 * Seeded by campaign and donor, so re-running a campaign over the same population —
 * or retrying a failed job — reaches the same verdict rather than resampling it.
 */
export function simulateDonationIntention(
	input: DonationIntentionInput,
): DonationIntentionOutcome {
	const probability = calculateIntentionProbability(input)

	// A business rule, not a draw: someone inside their waiting interval must never
	// produce a confirmation of intent to donate again, however willing the model
	// thinks they are.
	if (!input.donorIsEligible) {
		return { probability, willConfirm: false, responseDelaySeconds: null }
	}

	const willConfirm =
		createSeededRandom(
			SIMULATION_CONFIG.seed,
			DRAW.INTENTION,
			input.campaignId,
			input.donorId,
		)() < probability

	if (!willConfirm) {
		return { probability, willConfirm: false, responseDelaySeconds: null }
	}

	const responseDelaySeconds = sampleResponseDelaySeconds(
		createSeededRandom(
			SIMULATION_CONFIG.seed,
			DRAW.DELAY,
			input.campaignId,
			input.donorId,
		),
	)

	return { probability, willConfirm: true, responseDelaySeconds }
}

/**
 * Simulated seconds to the wall-clock delay the queue should wait, via
 * `SIMULATION_CONFIG.timeScale`. Rounded up so a heavily compressed run still waits
 * a whole second rather than firing immediately.
 */
export function toWallClockDelaySeconds(responseDelaySeconds: number): number {
	return Math.max(
		1,
		Math.ceil(responseDelaySeconds * SIMULATION_CONFIG.timeScale),
	)
}
