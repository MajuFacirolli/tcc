import { Client } from "pg"
import { E2E_DATABASE_URL } from "../env"

/**
 * Reads the end-to-end database directly.
 *
 * Raw SQL over `pg`, with no import from the API package: the tests run outside it and
 * must not drag its path aliases or its environment parsing into the Playwright
 * process.
 */
async function query<T>(text: string, values: unknown[] = []): Promise<T[]> {
	const client = new Client({ connectionString: E2E_DATABASE_URL })
	await client.connect()

	try {
		const { rows } = await client.query(text, values)
		return rows as T[]
	} finally {
		await client.end()
	}
}

export function getCampaignByTitle(title: string) {
	return query<{
		id: string
		status: string
		notified_count: number
		intention_confirmations_count: number
		total_eligible_donors: number
	}>(
		`select id, status, notified_count, intention_confirmations_count, total_eligible_donors
		 from campaigns where title = $1`,
		[title],
	).then((rows) => rows[0])
}

export function listConfirmations(campaignId: string) {
	return query<{ token: string; donor_id: string; confirmed_at: Date | null }>(
		`select token, donor_id, confirmed_at from confirmations
		 where campaign_id = $1 order by donor_id`,
		[campaignId],
	)
}
