import type { BloodType } from "@domain/value_objects/BloodType"
import type { Donor } from "@domain/entities/Donor"

export interface IDonorsRepository {
	findByBloodType(bloodType: BloodType): Promise<Array<Donor>>
}
