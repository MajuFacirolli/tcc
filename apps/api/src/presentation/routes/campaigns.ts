import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { container } from "@/container/Ioc.config"
import { TYPES } from "@/container/types"
import {
	apiErrorSchema,
	apiResponseSchema,
	pagedListSchema,
} from "@presentation/schemas/apiResponse"
import { paginationQuerySchema } from "@presentation/schemas/pagination"
import type { GetCampaignsController } from "@/presentation/controllers/campaigns/GetCampaignsController"
import type { GetCampaignsSummaryController } from "@/presentation/controllers/campaigns/GetCampaignsSummaryController"
import type { GetCampaignController } from "@/presentation/controllers/campaigns/GetCampaignController"
import type { CreateCampaignController } from "@/presentation/controllers/campaigns/CreateCampaignController"
import {
	campaignSchema,
	campaignStatusSchema,
	campaignSummarySchema,
} from "../schemas/campaigns"
import { bloodTypeSchema } from "../schemas/bloodType"

export const campaigns: FastifyPluginAsyncZod = async (app) => {
	app.addHook("onRequest", app.authenticate)

	const getCampaignsController = container.get<GetCampaignsController>(
		TYPES.GetCampaignsController,
	)
	const getCampaignsSummaryController =
		container.get<GetCampaignsSummaryController>(
			TYPES.GetCampaignsSummaryController,
		)
	const getCampaignController = container.get<GetCampaignController>(
		TYPES.GetCampaignController,
	)
	const createCampaignController = container.get<CreateCampaignController>(
		TYPES.CreateCampaignController,
	)

	app.get(
		"/api/campaigns",
		{
			schema: {
				summary: "List campaigns",
				tags: ["Campaigns"],
				security: [{ cookieAuth: [] }],
				querystring: paginationQuerySchema.extend({
					status: campaignStatusSchema.optional(),
					bloodType: bloodTypeSchema.optional(),
				}),
				response: {
					200: apiResponseSchema(pagedListSchema(campaignSchema)),
					400: apiErrorSchema,
					401: apiErrorSchema,
					404: apiErrorSchema,
				},
			},
		},
		(req, rep) => getCampaignsController.handle(req, rep),
	)

	app.get(
		"/api/campaigns/summary",
		{
			schema: {
				summary: "List recent campaigns",
				tags: ["Campaigns"],
				security: [{ cookieAuth: [] }],
				response: {
					200: apiResponseSchema(z.array(campaignSummarySchema)),
					401: apiErrorSchema,
					404: apiErrorSchema,
				},
			},
		},
		(req, rep) => getCampaignsSummaryController.handle(req, rep),
	)

	app.get(
		"/api/campaigns/:id",
		{
			schema: {
				summary: "Get campaign",
				tags: ["Campaigns"],
				security: [{ cookieAuth: [] }],
				params: z.object({ id: z.string() }),
				response: {
					200: apiResponseSchema(campaignSchema),
					401: apiErrorSchema,
					404: apiErrorSchema,
				},
			},
		},
		(req, rep) => getCampaignController.handle(req, rep),
	)

	app.post(
		"/api/campaigns",
		{
			schema: {
				summary: "Create campaign",
				tags: ["Campaigns"],
				security: [{ cookieAuth: [] }],
				body: z.object({
					title: z.string(),
					message: z.string("Message is required"),
					bloodType: bloodTypeSchema,
				}),
				response: {
					201: apiResponseSchema(z.string()),
					401: apiErrorSchema,
					404: apiErrorSchema,
				},
			},
		},
		(req, rep) => createCampaignController.handle(req, rep),
	)
}
