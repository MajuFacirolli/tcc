import { createHash } from "node:crypto"
import { asc } from "drizzle-orm"
import {
	type CampaignAudienceDonor,
	countEligibleInAudience,
	selectCampaignAudience,
} from "@domain/rules/campaignAudience"
import { isDonorEligible } from "@domain/rules/donorEligibility"
import { simulateDonationIntention } from "@domain/simulation/donationIntentionModel"
import { MS_PER_DAY, MS_PER_SECOND, startOfDay } from "@domain/utils/dateUtils"
import { createSeededRandom } from "@domain/utils/random"
import {
	type BloodBankStatus,
	mostSevereStatus,
} from "@domain/value_objects/BloodBankStatus"
import type { BloodType } from "@domain/value_objects/BloodType"
import type { CampaignKind } from "@domain/value_objects/CampaignKind"
import type { CampaignStatus } from "@domain/value_objects/CampaignStatus"
import type { Sex } from "@domain/value_objects/Sex"
import { DrizzleBloodBankRepository } from "@infrastructure/database/repositories/DrizzleBloodBankRepository"
import { db } from "./client"
import { campaigns, confirmations, donors } from "./schema/index"

/**
 * The two-week trial the metrics page reports on: seven generic campaigns interleaved
 * with seven segmented ones, over the same donor base.
 *
 * A conversion rate means nothing without the number it beats, so both arms are run.
 * Neither arm's result is written here — recipients come from `selectCampaignAudience`
 * and responses from `simulateDonationIntention`, the same functions the live path
 * calls, so every rate on the metrics page is an output of the model rather than a
 * figure chosen for it.
 *
 * Eligibility is resolved at each campaign's own date, a response the model places
 * after `now` stays pending, and ids and tokens are derived so re-running inserts
 * nothing new.
 *
 * Limitation worth stating: the arms are not disjoint donor groups. In the simulation
 * that costs nothing, because each draw is seeded by campaign *and* donor and so the
 * campaigns are independent; a trial with real donors would have to split the
 * population, since someone who ignored yesterday's e-mail is not a fresh observation.
 */

const SEED_SALT = "hemoconnect-seed-campaigns-v1"

/** The live flow enqueues one job per recipient, so notifications land over minutes. */
const DISPATCH_WINDOW_SECONDS = 15 * 60

/** Pulls a campaign back if the seed runs before its pinned hour of day. */
const MIN_CAMPAIGN_AGE_SECONDS = 3 * 60 * 60

const ACTIVE_WITHIN_DAYS = 2

type SeedCampaignDefinition = {
	daysAgo: number
	hourUtc: number
	/** `null` for a generic campaign, which asks for no type in particular. */
	bloodType: BloodType | null
	kind: CampaignKind
	title: string
	message: string
}

/**
 * Newest last. The segmented arm spans the stock levels the model reacts to — critical,
 * attention and stable — so the comparison does not rest only on campaigns run during
 * an emergency.
 */
const CAMPAIGN_DEFINITIONS: SeedCampaignDefinition[] = [
	{
		daysAgo: 13,
		hourUtc: 9,
		bloodType: null,
		kind: "generic",
		title: "Convocação geral de doadores",
		message:
			"Olá, [Nome]! O hemocentro precisa de doadores de sangue. Nossos estoques estão baixos e toda doação ajuda. Compareça de segunda a sábado, das 7h às 18h.",
	},
	{
		daysAgo: 12,
		hourUtc: 9,
		bloodType: "O+",
		kind: "segmented",
		title: "O positivo: você está apto a doar",
		message:
			"Olá, [Nome]! Seu tipo sanguíneo é O positivo e você já pode doar novamente. Nosso estoque desse tipo está crítico, e sua doação atende pacientes internados agora.",
	},
	{
		daysAgo: 11,
		hourUtc: 10,
		bloodType: null,
		kind: "generic",
		title: "Doe sangue, salve vidas",
		message:
			"[Nome], o hemocentro está com as reservas baixas e precisa da sua ajuda. Doar leva menos de uma hora e pode salvar até quatro vidas. Venha doar!",
	},
	{
		daysAgo: 10,
		hourUtc: 10,
		bloodType: "A+",
		kind: "segmented",
		title: "A positivo: sua doação está liberada",
		message:
			"Olá, [Nome]! Você é doador A positivo e já cumpriu o intervalo mínimo entre doações. Podemos contar com você para repor esse estoque?",
	},
	{
		daysAgo: 9,
		hourUtc: 14,
		bloodType: null,
		kind: "generic",
		title: "Campanha de doação de sangue",
		message:
			"[Nome], precisamos de doadores! Nossas reservas para atendimentos de urgência estão no limite. Se você pode doar, procure o hemocentro nesta semana.",
	},
	{
		daysAgo: 8,
		hourUtc: 14,
		bloodType: "O-",
		kind: "segmented",
		title: "O negativo: chamada urgente",
		message:
			"Olá, [Nome]! Você é O negativo, o doador universal, e está apto a doar. Nossa reserva de emergência está no limite e sua doação é a que atende qualquer paciente.",
	},
	{
		daysAgo: 7,
		hourUtc: 9,
		bloodType: null,
		kind: "generic",
		title: "Sua doação faz diferença",
		message:
			"[Nome], o hemocentro precisa repor os estoques. Doar leva cerca de 40 minutos e o atendimento é por agendamento. Venha nos visitar!",
	},
	{
		daysAgo: 6,
		hourUtc: 9,
		bloodType: "B+",
		kind: "segmented",
		title: "B positivo: você pode doar agora",
		message:
			"Olá, [Nome]! Seu tipo é B positivo, o estoque está em nível de atenção e você já pode doar novamente. Agende sua doação com a nossa equipe.",
	},
	{
		daysAgo: 5,
		hourUtc: 15,
		bloodType: null,
		kind: "generic",
		title: "Precisamos de doadores de sangue",
		message:
			"[Nome], as reservas do hemocentro estão baixas e alguns tipos sanguíneos estão em nível crítico. Qualquer doação ajuda a manter os atendimentos do hospital.",
	},
	{
		daysAgo: 4,
		hourUtc: 15,
		bloodType: "B-",
		kind: "segmented",
		title: "B negativo: tipo raro, doação urgente",
		message:
			"Olá, [Nome]! Você é doador B negativo, um tipo raro, e está apto a doar. Nosso estoque está abaixo do mínimo de segurança e sua doação é especialmente importante.",
	},
	{
		daysAgo: 3,
		hourUtc: 11,
		bloodType: null,
		kind: "generic",
		title: "Mutirão de doação de sangue",
		message:
			"[Nome], estamos organizando um mutirão de doação neste fim de semana. Todos os tipos sanguíneos são bem-vindos e o atendimento é sem fila.",
	},
	{
		daysAgo: 2,
		hourUtc: 11,
		bloodType: "AB+",
		kind: "segmented",
		title: "AB positivo: convocação de doadores",
		message:
			"Olá, [Nome]! Você é AB positivo e já pode doar novamente. Precisamos repor esse estoque para atender transfusões de plasma. Podemos contar com você?",
	},
	{
		daysAgo: 1,
		hourUtc: 9,
		bloodType: "O+",
		kind: "segmented",
		title: "O positivo: reposição de estoque",
		message:
			"Olá, [Nome]! Seu tipo sanguíneo é o mais utilizado nas transfusões e você está apto a doar. Confirme sua intenção e nós cuidamos do agendamento.",
	},
	{
		daysAgo: 0,
		hourUtc: 8,
		bloodType: null,
		kind: "generic",
		title: "Doe sangue hoje",
		message:
			"[Nome], o hemocentro está convocando doadores. Nossos estoques de emergência estão críticos e qualquer tipo sanguíneo ajuda a recompor a reserva.",
	},
]

function seedCampaignId(index: number): string {
	return `019318a1-0000-7000-8000-${String(index + 1).padStart(12, "0")}`
}

function seedConfirmationId(campaignIndex: number, donorIndex: number): string {
	const suffix = `${String(campaignIndex + 1).padStart(3, "0")}${String(
		donorIndex + 1,
	).padStart(9, "0")}`

	return `019318a2-0000-7000-8000-${suffix}`
}

/**
 * Same shape and length as the `randomBytes(32)` tokens production issues, but derived
 * so a re-run recognises its own rows instead of inserting duplicates.
 */
function seedConfirmationToken(campaignId: string, donorId: string): string {
	return createHash("sha256")
		.update(`${SEED_SALT}:${campaignId}:${donorId}`)
		.digest("base64url")
		.slice(0, 43)
}

export type SeedCampaignDonor = {
	id: string
	sex: Sex
	bloodType: BloodType
	lastDonationDate: Date | null
}

export type SeedCampaignRow = {
	id: string
	title: string
	message: string
	bloodType: BloodType | null
	kind: CampaignKind
	status: CampaignStatus
	totalEligibleDonors: number
	notifiedCount: number
	intentionConfirmationsCount: number
	averageResponseTime: number
	createdAt: Date
}

export type SeedConfirmationRow = {
	id: string
	token: string
	campaignId: string
	donorId: string
	confirmedAt: Date | null
	createdAt: Date
}

function resolveSentAt(
	definition: SeedCampaignDefinition,
	now: Date,
): { sentAt: Date; daysAgo: number } {
	const day = startOfDay(
		new Date(now.getTime() - definition.daysAgo * MS_PER_DAY),
	)
	const pinned = day.getTime() + definition.hourUtc * 60 * 60 * MS_PER_SECOND
	const latest = now.getTime() - MIN_CAMPAIGN_AGE_SECONDS * MS_PER_SECOND

	const sentAt = new Date(Math.min(pinned, latest))

	return { sentAt, daysAgo: (now.getTime() - sentAt.getTime()) / MS_PER_DAY }
}

/**
 * A donation dated after the campaign had not happened yet, so it cannot be what made
 * the donor wait back then.
 */
function donorAsOf(
	donor: SeedCampaignDonor,
	sentAt: Date,
): SeedCampaignDonor & CampaignAudienceDonor {
	if (!donor.lastDonationDate || donor.lastDonationDate <= sentAt) return donor

	return { ...donor, lastDonationDate: null }
}

function resolveStockStatus(
	bloodType: BloodType | null,
	statusByBloodType: Partial<Record<BloodType, BloodBankStatus>>,
): BloodBankStatus {
	if (bloodType === null)
		return mostSevereStatus(
			Object.values(statusByBloodType).filter(
				(status): status is BloodBankStatus => status !== undefined,
			),
		)

	return statusByBloodType[bloodType] ?? "stable"
}

export function buildSeedCampaigns({
	donors: donorPool,
	stockStatusByBloodType,
	now = new Date(),
}: {
	donors: SeedCampaignDonor[]
	stockStatusByBloodType: Partial<Record<BloodType, BloodBankStatus>>
	now?: Date
}): { campaigns: SeedCampaignRow[]; confirmations: SeedConfirmationRow[] } {
	const campaignRows: SeedCampaignRow[] = []
	const confirmationRows: SeedConfirmationRow[] = []

	for (const [campaignIndex, definition] of CAMPAIGN_DEFINITIONS.entries()) {
		const campaignId = seedCampaignId(campaignIndex)
		const { sentAt, daysAgo } = resolveSentAt(definition, now)

		const stockStatus = resolveStockStatus(
			definition.bloodType,
			stockStatusByBloodType,
		)

		const audience = selectCampaignAudience(
			donorPool.map((donor) => donorAsOf(donor, sentAt)),
			definition.kind,
			definition.bloodType,
			sentAt,
		)

		let confirmedCount = 0
		let responseTimeTotal = 0

		for (const [donorIndex, donor] of audience.entries()) {
			const dispatchOffset =
				createSeededRandom(SEED_SALT, "dispatch", campaignId, donor.id)() *
				DISPATCH_WINDOW_SECONDS

			const notifiedAt = new Date(
				sentAt.getTime() + Math.round(dispatchOffset) * MS_PER_SECOND,
			)

			const outcome = simulateDonationIntention({
				campaignId,
				donorId: donor.id,
				donorBloodType: donor.bloodType,
				campaignBloodType: definition.bloodType,
				donorIsEligible: isDonorEligible(
					donor.sex,
					donor.lastDonationDate,
					sentAt,
				),
				stockStatus,
			})

			const responseDelaySeconds = outcome.willConfirm
				? outcome.responseDelaySeconds
				: null

			const confirmedAt =
				responseDelaySeconds === null
					? null
					: new Date(
							notifiedAt.getTime() +
								Math.round(responseDelaySeconds) * MS_PER_SECOND,
						)

			// A response the model places after the clock has not happened yet.
			const isPending = confirmedAt !== null && confirmedAt > now

			if (confirmedAt && !isPending) {
				confirmedCount += 1
				responseTimeTotal += Math.round(
					(confirmedAt.getTime() - notifiedAt.getTime()) / MS_PER_SECOND,
				)
			}

			confirmationRows.push({
				id: seedConfirmationId(campaignIndex, donorIndex),
				token: seedConfirmationToken(campaignId, donor.id),
				campaignId,
				donorId: donor.id,
				confirmedAt: isPending ? null : confirmedAt,
				createdAt: notifiedAt,
			})
		}

		campaignRows.push({
			id: campaignId,
			title: definition.title,
			message: definition.message,
			bloodType: definition.bloodType,
			kind: definition.kind,
			status:
				daysAgo < ACTIVE_WITHIN_DAYS && audience.length > 0
					? "active"
					: "closed",
			totalEligibleDonors: countEligibleInAudience(audience, sentAt),
			notifiedCount: audience.length,
			intentionConfirmationsCount: confirmedCount,
			averageResponseTime:
				confirmedCount === 0
					? 0
					: Math.round(responseTimeTotal / confirmedCount),
			createdAt: sentAt,
		})
	}

	return { campaigns: campaignRows, confirmations: confirmationRows }
}

/** Postgres caps a statement at 65535 bound parameters; this stays well inside it. */
const INSERT_BATCH_SIZE = 250

export async function seedCampaigns() {
	const [donorPool, bloodBank] = await Promise.all([
		db
			.select({
				id: donors.id,
				sex: donors.sex,
				bloodType: donors.bloodType,
				lastDonationDate: donors.lastDonationDate,
			})
			.from(donors)
			// Stable order, so the index behind each confirmation id does not move.
			.orderBy(asc(donors.id)),
		new DrizzleBloodBankRepository().list(),
	])

	if (donorPool.length === 0) {
		console.log("⚠️  Skipped campaigns: no donors to notify")
		return
	}

	const stockStatusByBloodType = Object.fromEntries(
		bloodBank.map((entry) => [entry.id, entry.status]),
	) as Partial<Record<BloodType, BloodBankStatus>>

	const built = buildSeedCampaigns({
		donors: donorPool,
		stockStatusByBloodType,
	})

	const createdCampaigns = await db
		.insert(campaigns)
		.values(built.campaigns)
		.onConflictDoNothing({ target: campaigns.id })
		.returning({ id: campaigns.id })

	let createdConfirmations = 0

	for (
		let start = 0;
		start < built.confirmations.length;
		start += INSERT_BATCH_SIZE
	) {
		const inserted = await db
			.insert(confirmations)
			.values(built.confirmations.slice(start, start + INSERT_BATCH_SIZE))
			.onConflictDoNothing({ target: confirmations.id })
			.returning({ id: confirmations.id })

		createdConfirmations += inserted.length
	}

	console.log(
		`✅ Seeded campaigns: ${createdCampaigns.length} created, ${
			built.campaigns.length - createdCampaigns.length
		} already present`,
	)
	console.log(
		`✅ Seeded confirmations: ${createdConfirmations} created, ${
			built.confirmations.length - createdConfirmations
		} already present`,
	)
}
