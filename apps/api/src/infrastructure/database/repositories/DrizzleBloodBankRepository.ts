import type { IBloodBankRepository } from "@/application/interfaces/IBloodBankRepository"
import { BloodBank } from "@/domain/entities/BloodBank"
import { db } from "../drizzle/client"
import { bloodBank } from "../drizzle/schema"

export class DrizzleBloodBankRepository implements IBloodBankRepository {
	async list(): Promise<Array<BloodBank>> {
		const rows = await db.select().from(bloodBank)

		return rows.map(
			(row) =>
				new BloodBank(row.id, row.bagsCount, row.minThreshold, row.updatedAt),
		)
	}
}
