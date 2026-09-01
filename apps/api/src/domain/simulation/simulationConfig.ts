import type { BloodBankStatus } from "@domain/value_objects/BloodBankStatus"

/**
 * Every parameter of the donation-intention simulation, in one place.
 *
 * The donor base is synthetic and nobody is on the other side of the campaign
 * e-mails, so intention has to be *modelled* rather than observed. These weights are
 * the model. They live together, and only here, because the experiment is only
 * reproducible by someone who can read the numbers that produced it — scattering a
 * coefficient across three files would make the write-up guesswork.
 *
 * The weights are log-odds: they are summed into a score and squashed by a logistic
 * function, so each one moves the odds of a response by a factor of `e^weight`. They
 * are calibrated by intent, not fitted to data — there is no observed data to fit.
 */
export const SIMULATION_CONFIG = {
	/**
	 * Baseline log-odds for a donor with no favourable factor at all: not matching the
	 * campaign, not eligible, stable stock, average propensity. On its own `-4.3` is
	 * about a 1% response rate.
	 *
	 * It is calibrated from the other end, though — from the case that actually
	 * happens. Every donor a campaign reaches today is both eligible and of the
	 * targeted blood type, so the score a real notification is scored with is
	 * `intercept + bloodTypeMatchWeight + eligibleWeight`, and the intercept is what
	 * places *that* sum. It puts a stable-stock campaign near 25% intention, rising to
	 * roughly 43% when the stock is critical — the range a targeted appeal to donors
	 * who can actually donate can be defended at. Raising the intercept toward zero
	 * inflates every conversion rate the metrics page reports.
	 */
	intercept: -4.3,

	/**
	 * Applied when the donor's blood type is the one the campaign targets.
	 *
	 * Note for the record: the current flow selects recipients with
	 * `findByBloodType(campaign.bloodType)`, so in production this term always applies.
	 * It is still computed from the donor's actual blood type rather than assumed,
	 * which keeps the model honest if segmentation ever widens, and lets a test
	 * observe the factor in isolation.
	 */
	bloodTypeMatchWeight: 1.4,

	/**
	 * Applied when the donor may donate again. The strongest single term: someone
	 * inside their waiting interval has a concrete reason not to answer, and the
	 * factor should dominate a merely well-targeted campaign.
	 */
	eligibleWeight: 1.8,

	/**
	 * Scarcity of the campaign's blood type, read from `BloodBank.status`.
	 *
	 * These are the levels the system already has — `warning` is the "attention" tier.
	 * The steps are deliberately small next to eligibility: urgency in the message
	 * nudges someone who was already willing, it does not conjure a donor out of
	 * someone who cannot donate.
	 */
	urgencyWeights: {
		stable: 0,
		warning: 0.35,
		critical: 0.8,
	} satisfies Record<BloodBankStatus, number>,

	/**
	 * Half-width of each donor's individual propensity, in log-odds. A donor's value is
	 * drawn once from their id and never changes, spreading identical profiles across
	 * roughly a 4x range in odds while leaving the ranking of the named factors intact
	 * — the point is that two donors with the same characteristics differ, not that
	 * the outcome becomes noise.
	 */
	propensitySpread: 0.7,

	/** Fastest a simulated donor reacts. Nobody answers an e-mail instantly. */
	minResponseDelaySeconds: 90,

	/**
	 * Mean of the exponential tail. Six hours puts most responses inside the first
	 * working day while leaving a long tail of stragglers, which is the shape that
	 * makes "confirmations over time" worth plotting.
	 */
	meanResponseDelaySeconds: 6 * 60 * 60,

	/** Nobody answers a campaign e-mail after two days; the draw is truncated here. */
	maxResponseDelaySeconds: 48 * 60 * 60,

	/**
	 * Simulated seconds to wall-clock seconds, applied when the delayed job is queued.
	 *
	 * `1 / 3600` reads as "one simulated hour per real second": a campaign's responses
	 * arrive over about a minute instead of two days, so the dashboard can be watched
	 * filling. Set this to `1` to run the experiment in real time.
	 *
	 * This scaling is the only thing separating simulated time from recorded time.
	 * Confirmations are written by the ordinary confirmation path, so
	 * `confirmedAt - createdAt` — the difference every metric is computed from — is the
	 * *scaled* delay. Response times on the metrics page are therefore in compressed
	 * units, and consistent with each other.
	 */
	timeScale: 1 / 3600,

	/**
	 * Salts every draw. Changing it reshuffles which donors respond, without changing
	 * any donor's characteristics — the way to run a second, independent replication
	 * of the experiment over the same population.
	 */
	seed: "hemoconnect-simulation-v1",
} as const
