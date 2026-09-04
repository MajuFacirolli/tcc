interface IWaitForOptions {
	timeout?: number
	interval?: number
	/** Included in the timeout message — usually the failures a worker reported. */
	describe?: () => string
}

/**
 * Polls until a condition holds.
 *
 * Dispatch tests wait on a terminal state rather than on an event, because the queue's
 * own semantics give one: `close-campaign` is the flow's parent, so a campaign reaching
 * `closed` means every e-mail child finished.
 */
export async function waitFor(
	condition: () => Promise<boolean> | boolean,
	{ timeout = 15_000, interval = 100, describe }: IWaitForOptions = {},
) {
	const deadline = Date.now() + timeout

	while (Date.now() < deadline) {
		if (await condition()) return
		await new Promise((resolve) => setTimeout(resolve, interval))
	}

	// A job that failed retries three times with a 5s exponential backoff, which
	// otherwise just looks like a hang.
	throw new Error(
		`Timed out after ${timeout}ms waiting for a condition${
			describe ? `. ${describe()}` : ""
		}`,
	)
}
