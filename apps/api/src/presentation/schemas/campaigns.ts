import { CAMPAIGN_STATUSES } from "@/domain/value_objects/CampaignStatus"
import { z } from "zod"
import { bloodTypeSchema } from "./bloodType"

export const campaignStatusSchema = z.enum(CAMPAIGN_STATUSES)

export const campaignSchema = z.object({
	id: z.string(),
	title: z.string(),
	message: z.string(),
	bloodType: bloodTypeSchema,
	status: campaignStatusSchema,
	notifiedCount: z.number(),
	confirmationsCount: z.number(),
	conversionRate: z.number(),
	createdAt: z.iso.datetime(),
})

export const campaignSummarySchema = z.object({
	id: z.string(),
	title: z.string(),
	bloodType: bloodTypeSchema,
	notifiedCount: z.number(),
	conversionRate: z.number(),
})

export const createCampaignBodySchema = z.object({
	title: z.string().min(1, "Título é obrigatório"),
	message: z.string().min(1, "Mensagem é obrigatória"),
	bloodType: bloodTypeSchema,
})
