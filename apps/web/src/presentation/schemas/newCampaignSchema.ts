import { BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"
import { z } from "zod"

export const newCampaignSchema = z.object({
	title: z.string().min(1, "Informe o título da campanha"),
	bloodType: z.enum(BloodTypeEnum, "Informe o tipo sanguíneo"),
	message: z.string().min(1, "Informe o conteúdo da mensagem"),
})

export type NewCampaignSchema = z.infer<typeof newCampaignSchema>
