import { BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"
import { CampaignKindEnum } from "@/domain/enums/CampaignKindEnum"
import { z } from "zod"

export const newCampaignSchema = z
	.object({
		title: z.string().min(1, "Informe o título da campanha"),
		kind: z.enum(CampaignKindEnum, "Informe o tipo de envio"),
		bloodType: z.enum(BloodTypeEnum).nullish(),
		message: z.string().min(1, "Informe o conteúdo da mensagem"),
	})
	.refine(
		(data) => data.kind === CampaignKindEnum.GENERIC || !!data.bloodType,
		{ message: "Informe o tipo sanguíneo", path: ["bloodType"] },
	)

export type NewCampaignSchema = z.infer<typeof newCampaignSchema>
