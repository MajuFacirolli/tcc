import { BLOOD_TYPES, type BloodType } from "@domain/value_objects/BloodType"
import type { Sex } from "@domain/value_objects/Sex"
import { MS_PER_DAY } from "@domain/utils/dateUtils"
import { ELIGIBILITY_DAYS } from "@domain/rules/donorEligibility"
import { createRandom } from "@domain/utils/random"
import { db } from "./client"
import { donors } from "./schema/index"

/**
 * Demo donors, so the listing, its filters and the campaign flow have something to
 * work with on a fresh database.
 *
 * Three constraints shape this data:
 *
 * - **Addresses must be undeliverable.** Creating a campaign enqueues a real e-mail
 *   to every eligible donor of that blood type, so every seeded address lives under
 *   `example.com`, reserved by RFC 2606 precisely so it can never reach a person.
 * - **Generated, but not random.** A thousand donors are too many to write by hand, so
 *   they are drawn from name pools by a seeded PRNG. Same seed, same thousand donors —
 *   `Math.random` would hand you a different database on every run.
 * - **Re-running changes nothing.** Ids are derived from the row index and the insert is
 *   `onConflictDoNothing`, so the seed never duplicates a donor and never touches one a
 *   user created.
 */

const TOTAL_DONORS = 1000

/** Any fixed value works; changing it reshuffles every generated donor. */
const RANDOM_SEED = 20260826

const NEVER_DONATED_RATE = 0.15

/**
 * Upper bound for a generated donation offset. Paired with the squared curve in
 * `pickDaysSinceLastDonation`, it puts a little under half the donors inside their
 * waiting interval — a split worth looking at, rather than a table where almost
 * everyone is eligible.
 */
const MAX_DAYS_SINCE_LAST_DONATION = 400

/** Approximates the Brazilian distribution: O+ and A+ dominate, AB- is rare. */
const BLOOD_TYPE_WEIGHTS: Record<BloodType, number> = {
	"O+": 36,
	"A+": 34,
	"O-": 9,
	"B+": 8,
	"A-": 8,
	"AB+": 2.5,
	"B-": 2,
	"AB-": 0.5,
}

/**
 * Donors pinned to the exact edges of the rule, so a fresh database always contains
 * the cases worth checking the filter against instead of leaving them to chance.
 * Applied over the first generated donors, whose names and blood types are kept.
 *
 * A case says *where the donor sits relative to their own threshold*, never how many
 * days that is. Resolving the day count through `ELIGIBILITY_DAYS[sex]` at build time
 * is what makes it impossible to describe a man by the women's interval, or the other
 * way round — a cross-reference that would produce a donor whose data belongs to the
 * wrong rule.
 */
type BoundaryCase = {
	sex: Sex
	/** Days past the donor's own threshold; `null` for a donor who never donated. */
	offsetFromThreshold: number | null
}

const BOUNDARY_CASES: BoundaryCase[] = [
	{ sex: "male", offsetFromThreshold: -1 },
	{ sex: "male", offsetFromThreshold: 0 },
	{ sex: "male", offsetFromThreshold: 1 },
	{ sex: "female", offsetFromThreshold: -1 },
	{ sex: "female", offsetFromThreshold: 0 },
	{ sex: "female", offsetFromThreshold: 1 },
	{ sex: "male", offsetFromThreshold: null },
	{ sex: "female", offsetFromThreshold: null },
]

function resolveBoundaryDays(boundary: BoundaryCase): number | null {
	if (boundary.offsetFromThreshold === null) return null

	return ELIGIBILITY_DAYS[boundary.sex] + boundary.offsetFromThreshold
}

const MALE_FIRST_NAMES = [
	"Alexandre",
	"André",
	"Antônio",
	"Arthur",
	"Augusto",
	"Benício",
	"Bernardo",
	"Breno",
	"Bruno",
	"Caio",
	"Carlos",
	"César",
	"Daniel",
	"Danilo",
	"Davi",
	"Diego",
	"Eduardo",
	"Emanuel",
	"Enzo",
	"Fábio",
	"Felipe",
	"Fernando",
	"Francisco",
	"Gabriel",
	"Gustavo",
	"Heitor",
	"Henrique",
	"Hugo",
	"Igor",
	"Isaac",
	"João",
	"Joaquim",
	"Jorge",
	"José",
	"Juliano",
	"Leandro",
	"Leonardo",
	"Lucas",
	"Luiz",
	"Marcelo",
	"Marcos",
	"Mateus",
	"Matheus",
	"Miguel",
	"Murilo",
	"Nicolas",
	"Otávio",
	"Paulo",
	"Pedro",
	"Rafael",
	"Raul",
	"Renato",
	"Ricardo",
	"Roberto",
	"Rodrigo",
	"Samuel",
	"Sérgio",
	"Thiago",
	"Vicente",
	"Vinícius",
]

const FEMALE_FIRST_NAMES = [
	"Adriana",
	"Alice",
	"Amanda",
	"Ana",
	"Beatriz",
	"Bianca",
	"Bruna",
	"Camila",
	"Carolina",
	"Cecília",
	"Clara",
	"Cristiane",
	"Daniela",
	"Débora",
	"Eduarda",
	"Elisa",
	"Eloá",
	"Fernanda",
	"Flávia",
	"Gabriela",
	"Giovanna",
	"Heloísa",
	"Helena",
	"Isabela",
	"Isadora",
	"Joana",
	"Júlia",
	"Juliana",
	"Larissa",
	"Laura",
	"Letícia",
	"Lívia",
	"Luana",
	"Lucia",
	"Luiza",
	"Manuela",
	"Marcela",
	"Maria",
	"Mariana",
	"Marina",
	"Melissa",
	"Natália",
	"Nicole",
	"Olívia",
	"Patrícia",
	"Paula",
	"Rafaela",
	"Raquel",
	"Renata",
	"Sabrina",
	"Sara",
	"Simone",
	"Sofia",
	"Tatiane",
	"Valentina",
	"Vanessa",
	"Vitória",
	"Yasmin",
]

const SURNAMES = [
	"Almeida",
	"Alves",
	"Andrade",
	"Araújo",
	"Azevedo",
	"Barbosa",
	"Barros",
	"Batista",
	"Bezerra",
	"Braga",
	"Caldeira",
	"Camargo",
	"Campos",
	"Cardoso",
	"Carvalho",
	"Castro",
	"Cavalcanti",
	"Coelho",
	"Correia",
	"Costa",
	"Cunha",
	"Dias",
	"Duarte",
	"Esteves",
	"Farias",
	"Fernandes",
	"Ferreira",
	"Fonseca",
	"Freitas",
	"Garcia",
	"Gomes",
	"Gonçalves",
	"Guimarães",
	"Lima",
	"Lopes",
	"Macedo",
	"Machado",
	"Magalhães",
	"Marques",
	"Martins",
	"Medeiros",
	"Melo",
	"Mendes",
	"Miranda",
	"Monteiro",
	"Moraes",
	"Moreira",
	"Moura",
	"Nascimento",
	"Neves",
	"Nogueira",
	"Nunes",
	"Oliveira",
	"Pacheco",
	"Peixoto",
	"Pereira",
	"Pinheiro",
	"Pinto",
	"Prado",
	"Queiroz",
	"Ramos",
	"Rezende",
	"Ribeiro",
	"Rocha",
	"Rodrigues",
	"Sales",
	"Sampaio",
	"Santos",
	"Silva",
	"Silveira",
	"Siqueira",
	"Soares",
	"Sousa",
	"Tavares",
	"Teixeira",
	"Vieira",
	"Xavier",
]

function pick<T>(random: () => number, items: readonly T[]): T {
	return items[Math.floor(random() * items.length)] as T
}

const TOTAL_BLOOD_TYPE_WEIGHT = Object.values(BLOOD_TYPE_WEIGHTS).reduce(
	(total, weight) => total + weight,
	0,
)

function pickBloodType(random: () => number): BloodType {
	let cursor = random() * TOTAL_BLOOD_TYPE_WEIGHT

	for (const bloodType of BLOOD_TYPES) {
		cursor -= BLOOD_TYPE_WEIGHTS[bloodType]
		if (cursor <= 0) return bloodType
	}

	// Only reachable through floating-point drift on the last slice.
	return BLOOD_TYPES[BLOOD_TYPES.length - 1] as BloodType
}

/**
 * Squaring the draw biases offsets toward recent donations, which is both realistic
 * — most people who donate did so in the last few months — and what keeps a healthy
 * share of donors inside their waiting interval.
 */
function pickDaysSinceLastDonation(random: () => number): number | null {
	if (random() < NEVER_DONATED_RATE) return null

	const draw = random() ** 2

	return 1 + Math.floor(draw * MAX_DAYS_SINCE_LAST_DONATION)
}

/** Fixed uuidv7-shaped ids, so re-running the seed maps onto the same rows. */
function seedDonorId(index: number): string {
	return `019318a0-0000-7000-8000-${String(index + 1).padStart(12, "0")}`
}

/** "João Vitor Freitas" -> "joao.vitor.freitas@example.com" */
function toEmailLocalPart(name: string): string {
	return name
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, ".")
		.replace(/^\.|\.$/g, "")
}

export function buildSeedDonors(now: number = Date.now()) {
	const random = createRandom(RANDOM_SEED)
	const usedEmails = new Map<string, number>()

	return Array.from({ length: TOTAL_DONORS }, (_, index) => {
		const generatedSex: Sex = random() < 0.5 ? "male" : "female"
		const bloodType = pickBloodType(random)
		const generatedDays = pickDaysSinceLastDonation(random)

		const boundary = BOUNDARY_CASES[index]
		const sex = boundary?.sex ?? generatedSex
		const daysSinceLastDonation = boundary
			? resolveBoundaryDays(boundary)
			: generatedDays

		const firstName = pick(
			random,
			sex === "male" ? MALE_FIRST_NAMES : FEMALE_FIRST_NAMES,
		)
		const name = `${firstName} ${pick(random, SURNAMES)} ${pick(random, SURNAMES)}`

		// Names repeat across a thousand draws; addresses must not.
		const localPart = toEmailLocalPart(name)
		const seen = usedEmails.get(localPart) ?? 0
		usedEmails.set(localPart, seen + 1)

		return {
			id: seedDonorId(index),
			name,
			sex,
			bloodType,
			lastDonationDate:
				daysSinceLastDonation === null
					? null
					: new Date(now - daysSinceLastDonation * MS_PER_DAY),
			email: `${localPart}${seen === 0 ? "" : seen + 1}@example.com`,
		}
	})
}

/** Postgres caps a statement at 65535 bound parameters; this stays well inside it. */
const INSERT_BATCH_SIZE = 250

export async function seedDonors() {
	const rows = buildSeedDonors()
	let created = 0

	for (let start = 0; start < rows.length; start += INSERT_BATCH_SIZE) {
		const inserted = await db
			.insert(donors)
			.values(rows.slice(start, start + INSERT_BATCH_SIZE))
			.onConflictDoNothing({ target: donors.id })
			.returning({ id: donors.id })

		created += inserted.length
	}

	console.log(
		`✅ Seeded donors: ${created} created, ${rows.length - created} already present`,
	)
}
