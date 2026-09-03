import type { BloodType } from "@domain/value_objects/BloodType"
import type { Donor } from "@domain/entities/Donor"
import type { ListDonorsInput } from "../dtos/donors/ListDonorsInput"
import type { ListDonorsOutput } from "../dtos/donors/ListDonorsOutput"

export interface IDonorsRepository {
	list(params: ListDonorsInput): Promise<ListDonorsOutput>
	findByBloodType(bloodType: BloodType): Promise<Array<Donor>>
	findAll(): Promise<Array<Donor>>
	countEligibleByBloodType(bloodType: BloodType): Promise<number>
}
