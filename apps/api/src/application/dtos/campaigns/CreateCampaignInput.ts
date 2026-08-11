import type { BloodType } from "@/domain/value_objects/BloodType"

export type CreateCampaignsInput = {
	title: string
	message: string
	bloodType: BloodType
}
