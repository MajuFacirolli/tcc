import type { BloodType } from "@/domain/value_objects/BloodType"

export type CreateCampaignsInputDTO = {
	title: string
	message: string
	bloodType: BloodType
}
