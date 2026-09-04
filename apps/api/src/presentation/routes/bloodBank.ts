import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { apiErrorSchema, apiResponseSchema } from "../schemas/apiResponse"
import { bloodBankSummarySchema } from "../schemas/bloodBank"
import { container } from "@/container/Ioc.config"
import type { GetBloodBankSummaryController } from "../controllers/bloodBank/GetBloodBankSummary"
import { TYPES } from "@/container/types"

export const bloodBank: FastifyPluginAsyncZod = async (app) => {
	app.addHook("onRequest", app.authenticate)

	const getBloodBankSummaryController =
		container.get<GetBloodBankSummaryController>(
			TYPES.GetBloodBankSummaryController,
		)

	app.get(
		"/api/bloodBank/summary",
		{
			schema: {
				summary: "Get blood bank summary",
				tags: ["Blood Bank"],
				security: [{ cookieAuth: [] }],
				response: {
					200: apiResponseSchema(bloodBankSummarySchema),
					401: apiErrorSchema,
					404: apiErrorSchema,
				},
			},
		},
		async (req, res) => getBloodBankSummaryController.handle(req, res),
	)
}
