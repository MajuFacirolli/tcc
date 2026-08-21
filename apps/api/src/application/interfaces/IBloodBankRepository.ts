import type { BloodBank } from "@/domain/entities/BloodBank"

export interface IBloodBankRepository {
	list(): Promise<Array<BloodBank>>
}
