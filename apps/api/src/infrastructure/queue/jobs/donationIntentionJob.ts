import { container } from "@/container/Ioc.config"
import { TYPES } from "@/container/types"
import type { ConfirmDonationIntentionUseCase } from "@application/use_cases/confirmations/ConfirmDonationIntention"
import { QUEUE_NAMES } from "@/application/queues/queueNames"
import type { JobDefinition } from "../JobDefinition"
import type { SimulateDonationIntentionInput } from "@/application/dtos/simulation/SimulateDonationIntentionInput"

/**
 * Delivers a simulated donor's response once its delay has elapsed.
 *
 * It reuses `ConfirmDonationIntentionUseCase` — the very use case the public
 * confirmation route calls — rather than writing the confirmation itself. That is
 * what keeps the experiment's data indistinguishable from a real click: the same
 * transaction marks `confirmedAt`, increments the campaign's confirmation count and
 * folds the response time into its running average, so every existing metric is fed
 * without a second code path to keep in step.
 *
 * Re-running a job is safe: a confirmation already recorded comes back as
 * `alreadyConfirmed` and is not counted twice.
 */
export const donationIntentionJobDefinition: JobDefinition<SimulateDonationIntentionInput> =
	{
		queueName: QUEUE_NAMES.DONATION_INTENTION,
		concurrency: 5,
		async process(job) {
			const useCase = container.get<ConfirmDonationIntentionUseCase>(
				TYPES.ConfirmDonationIntentionUseCase,
			)
			await useCase.execute(job.data.token)
		},
	}
