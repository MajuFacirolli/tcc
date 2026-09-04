import { eq } from "drizzle-orm"
import { db } from "@infrastructure/database/drizzle/client"
import {
	bloodBank,
	campaigns,
	confirmations,
	donors,
} from "@infrastructure/database/drizzle/schema/index"
import { ELIGIBILITY_DAYS } from "@domain/rules/donorEligibility"
import { MS_PER_DAY } from "@domain/utils/dateUtils"
import type { BloodType } from "@domain/value_objects/BloodType"
import type { CampaignStatus } from "@domain/value_objects/CampaignStatus"
import type { CampaignKind } from "@domain/value_objects/CampaignKind"
import type { Sex } from "@domain/value_objects/Sex"

/**
 * The real clock, not a pinned instant: the use cases under test call `new Date()`
 * themselves, so a fixture dated against a frozen `NOW` would sit the wrong side of a
 * waiting interval.
 */
export const daysAgo = (days: number) =>
	new Date(Date.now() - days * MS_PER_DAY)

interface IDonorFixture {
	id: string
	name: string
	sex?: Sex
	bloodType: BloodType
	/** `null` means never donated, which always makes the donor eligible. */
	lastDonationDate?: Date | null
	email?: string
}

/**
 * Donors are written explicitly rather than drawn from the seed: every integration
 * assertion here turns on a donor sitting on a known side of their own waiting
 * interval, and a generated pool would make the expected counts a moving target.
 */
export async function insertDonors(fixtures: IDonorFixture[]) {
	const rows = fixtures.map((fixture) => ({
		id: fixture.id,
		name: fixture.name,
		sex: fixture.sex ?? ("male" as Sex),
		bloodType: fixture.bloodType,
		lastDonationDate:
			fixture.lastDonationDate === undefined ? null : fixture.lastDonationDate,
		email: fixture.email ?? `${fixture.id}@example.com`,
	}))

	await db.insert(donors).values(rows)

	return rows
}

/** Past their own threshold by a day, so the fixture is not sitting on the boundary. */
export const eligibleDonor = (
	id: string,
	bloodType: BloodType,
	sex: Sex = "male",
): IDonorFixture => ({
	id,
	name: `Apto ${id}`,
	sex,
	bloodType,
	lastDonationDate: daysAgo(ELIGIBILITY_DAYS[sex] + 1),
})

/** One day short of their threshold: cannot donate again yet. */
export const waitingDonor = (
	id: string,
	bloodType: BloodType,
	sex: Sex = "male",
): IDonorFixture => ({
	id,
	name: `Aguardando ${id}`,
	sex,
	bloodType,
	lastDonationDate: daysAgo(ELIGIBILITY_DAYS[sex] - 1),
})

export async function insertBloodBank(
	entries: Array<{ id: BloodType; bagsCount: number; minThreshold?: number }>,
) {
	await db.insert(bloodBank).values(
		entries.map((entry) => ({
			id: entry.id,
			bagsCount: entry.bagsCount,
			minThreshold: entry.minThreshold ?? 1250,
		})),
	)
}

export async function getCampaign(id: string) {
	const [row] = await db.select().from(campaigns).where(eq(campaigns.id, id))
	return row
}

export async function listCampaigns() {
	return db.select().from(campaigns)
}

export async function listConfirmations(campaignId: string) {
	return db
		.select()
		.from(confirmations)
		.where(eq(confirmations.campaignId, campaignId))
}

export async function insertCampaign(
	overrides: {
		id?: string
		title?: string
		message?: string
		bloodType?: BloodType | null
		kind?: CampaignKind
		status?: CampaignStatus
		totalEligibleDonors?: number
		notifiedCount?: number
		intentionConfirmationsCount?: number
		averageResponseTime?: number
	} = {},
) {
	const [row] = await db
		.insert(campaigns)
		.values({
			title: overrides.title ?? "Campanha de teste",
			message: overrides.message ?? "Olá, [Nome]!",
			bloodType: overrides.bloodType ?? "O-",
			kind: overrides.kind ?? "segmented",
			status: overrides.status ?? "active",
			totalEligibleDonors: overrides.totalEligibleDonors ?? 0,
			notifiedCount: overrides.notifiedCount ?? 0,
			intentionConfirmationsCount: overrides.intentionConfirmationsCount ?? 0,
			averageResponseTime: overrides.averageResponseTime ?? 0,
			...(overrides.id ? { id: overrides.id } : {}),
		})
		.returning({ id: campaigns.id })

	return row.id
}

export async function insertConfirmation(values: {
	token: string
	campaignId: string
	donorId: string
	/** Notified this long before now, which is the response time a confirm records. */
	notifiedSecondsAgo?: number
	confirmedAt?: Date | null
}) {
	await db.insert(confirmations).values({
		token: values.token,
		campaignId: values.campaignId,
		donorId: values.donorId,
		confirmedAt: values.confirmedAt ?? null,
		createdAt: new Date(Date.now() - (values.notifiedSecondsAgo ?? 0) * 1000),
	})
}
