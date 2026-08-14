import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import {
	apiErrorSchema,
	apiResponseSchema,
} from "@presentation/schemas/apiResponse"
import { container } from "@/container/Ioc.config"
import { TYPES } from "@/container/types"
import type { ConfirmDonationIntentionController } from "../controllers/confirmations/ConfirmDonationIntention"

export const confirmations: FastifyPluginAsyncZod = async (app) => {
	const confirmDonationIntentionController =
		container.get<ConfirmDonationIntentionController>(
			TYPES.ConfirmDonationIntentionController,
		)

	app.post(
		"/api/confirmations/:token",
		{
			schema: {
				summary: "Confirm donation intention",
				tags: ["Confirmations"],
				params: z.object({ token: z.string() }),
				response: {
					200: apiResponseSchema(
						z.object({
							confirmedAt: z.iso.datetime(),
						}),
					),
					400: apiErrorSchema,
					404: apiErrorSchema,
				},
			},
		},
		async (req, rep) => confirmDonationIntentionController.handle(req, rep),
	)
}
