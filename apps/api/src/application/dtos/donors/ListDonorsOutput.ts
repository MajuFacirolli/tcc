import type { Donor } from "@/domain/entities/Donor"

export type ListDonorsOutput = {
	items: Array<Donor>
	total: number
}
