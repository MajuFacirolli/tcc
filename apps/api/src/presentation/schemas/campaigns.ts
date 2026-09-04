import { CAMPAIGN_KINDS } from "@/domain/value_objects/CampaignKind"
import { CAMPAIGN_STATUSES } from "@/domain/value_objects/CampaignStatus"
import { z } from "zod"
import { bloodTypeSchema } from "./bloodType"

export const campaignStatusSchema = z.enum(CAMPAIGN_STATUSES)

export const campaignKindSchema = z.enum(
	CAMPAIGN_KINDS,
	"Informe um tipo de campanha válido",
)

export const campaignSchema = z.object({
	id: z.string(),
	title: z.string(),
	message: z.string(),
	bloodType: bloodTypeSchema.nullable(),
	kind: campaignKindSchema,
	status: campaignStatusSchema,
	notifiedCount: z.number(),
	eligibleReached: z.number(),
	confirmationsCount: z.number(),
	conversionRate: z.number(),
	createdAt: z.iso.datetime(),
})

export const campaignSummarySchema = z.object({
	id: z.string(),
	title: z.string(),
	bloodType: bloodTypeSchema.nullable(),
	kind: campaignKindSchema,
	notifiedCount: z.number(),
	conversionRate: z.number(),
})

export const createCampaignBodySchema = z
	.object({
		title: z.string().min(1, "Título é obrigatório"),
		message: z.string().min(1, "Mensagem é obrigatória"),
		kind: campaignKindSchema.default("segmented"),
		bloodType: bloodTypeSchema.nullish().transform((value) => value ?? null),
	})
	.refine((data) => data.kind === "generic" || data.bloodType !== null, {
		message: "Tipo sanguíneo é obrigatório em campanhas segmentadas",
		path: ["bloodType"],
	})
