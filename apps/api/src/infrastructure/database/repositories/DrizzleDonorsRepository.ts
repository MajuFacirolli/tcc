import { and, asc, eq, not, sql } from "drizzle-orm"
import { db } from "@infrastructure/database/drizzle/client"
import { donors } from "@infrastructure/database/drizzle/schema/index"
import { donorEligibilitySql } from "@infrastructure/database/drizzle/donorEligibility"
import { Donor } from "@domain/entities/Donor"
import type { IDonorsRepository } from "@application/interfaces/IDonorsRepository"
import type { BloodType } from "@domain/value_objects/BloodType"
import type { ListDonorsInput } from "@/application/dtos/donors/ListDonorsInput"
import { DEFAULT_PAGE_SIZE } from "@/core/PagedList"
import type { ListDonorsOutput } from "@/application/dtos/donors/ListDonorsOutput"

export class DrizzleDonorsRepository implements IDonorsRepository {
	private rowToDonor(row: typeof donors.$inferSelect): Donor {
		return new Donor(
			row.id,
			row.name,
			row.sex,
			row.bloodType,
			row.lastDonationDate,
			row.email,
		)
	}

	async list(params: ListDonorsInput): Promise<ListDonorsOutput> {
		const limit = params.limit ?? DEFAULT_PAGE_SIZE
		const offset = (params.page - 1) * limit

		// A null `isEligible` means "no eligibility filter", so both groups are returned.
		const eligibilityFilter =
			params.isEligible === null
				? undefined
				: params.isEligible
					? donorEligibilitySql
					: not(donorEligibilitySql)

		const filters = and(
			params.bloodType ? eq(donors.bloodType, params.bloodType) : undefined,
			eligibilityFilter,
		)

		const [countRow] = await db
			.select({ total: sql<number>`count(*)` })
			.from(donors)
			.where(filters)

		const rows = await db
			.select()
			.from(donors)
			.where(filters)
			.orderBy(asc(donors.name), asc(donors.id))
			.limit(limit)
			.offset(offset)

		return {
			items: rows.map((row) => this.rowToDonor(row)),
			total: Number(countRow?.total ?? 0),
		}
	}

	async findByBloodType(bloodType: BloodType): Promise<Array<Donor>> {
		const rows = await db
			.select()
			.from(donors)
			.where(eq(donors.bloodType, bloodType))

		return rows.map((row) => this.rowToDonor(row))
	}
}
