import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { BLOOD_TYPES } from "@domain/value_objects/BloodType"
import { CAMPAIGN_STATUSES } from "@domain/value_objects/CampaignStatus"
import { container } from "@/container/Ioc.config"
import { TYPES } from "@/container/types"
import type { GetCampaignsController } from "@presentation/controllers/GetCampaignsController"

const bloodTypeSchema = z.enum(BLOOD_TYPES)
const campaignStatusSchema = z.enum(CAMPAIGN_STATUSES)

const campaignSchema = z.object({
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

const campaignSummarySchema = z.object({
	id: z.string(),
	title: z.string(),
	bloodType: bloodTypeSchema,
	notifiedCount: z.number(),
	conversionRate: z.number(),
})

const notFoundSchema = z.object({
	status: z.number(),
	message: z.string(),
})

export const campaigns: FastifyPluginAsyncZod = async (app) => {
	const controller = container.get<GetCampaignsController>(
		TYPES.GetCampaignsController,
	)

	app.get(
		"/api/campaigns",
		{
			schema: {
				summary: "List campaigns",
				tags: ["Campaigns"],
				querystring: z.object({
					status: campaignStatusSchema.optional(),
					bloodType: bloodTypeSchema.optional(),
				}),
				response: {
					200: z.array(campaignSchema),
					404: notFoundSchema,
				},
			},
		},
		controller.handle.bind(controller),
	)

	app.get(
		"/api/campaigns/summary",
		{
			schema: {
				summary: "List recent campaigns",
				tags: ["Campaigns"],
				response: {
					200: z.array(campaignSummarySchema),
					404: notFoundSchema,
				},
			},
		},
		() => {},
	)

	app.get(
		"/api/campaigns/:id",
		{
			schema: {
				summary: "Get campaign",
				tags: ["Campaigns"],
				response: {
					200: campaignSchema,
					404: notFoundSchema,
				},
			},
		},
		() => {},
	)

	app.post(
		"/api/campaigns",
		{
			schema: {
				summary: "Create campaign",
				tags: ["Campaigns"],
				body: z.object({
					title: z.string(),
					message: z.string(),
					bloodType: bloodTypeSchema,
				}),
				response: {
					201: z.void(),
					404: notFoundSchema,
				},
			},
		},
		() => {},
	)
}
