import { eq } from "drizzle-orm"
import { db } from "@infrastructure/database/drizzle/client"
import { donors } from "@infrastructure/database/drizzle/schema/index"
import { Donor } from "@domain/entities/Donor"
import type { IDonorsRepository } from "@application/interfaces/IDonorsRepository"
import type { BloodType } from "@domain/value_objects/BloodType"

export class DrizzleDonorsRepository implements IDonorsRepository {
	async findByBloodType(bloodType: BloodType): Promise<Array<Donor>> {
		const rows = await db
			.select()
			.from(donors)
			.where(eq(donors.bloodType, bloodType))

		return rows.map(
			(row) =>
				new Donor(
					row.id,
					row.name,
					row.sex,
					row.bloodType,
					row.lastDonationDate,
					row.email,
				),
		)
	}
}
