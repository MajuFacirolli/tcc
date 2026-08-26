import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { container } from "@/container/Ioc.config"
import { TYPES } from "@/container/types"
import {
	apiErrorSchema,
	apiResponseSchema,
	pagedListSchema,
} from "@presentation/schemas/apiResponse"
import { paginationQuerySchema } from "@presentation/schemas/pagination"
import type { GetDonorsController } from "@/presentation/controllers/donors/GetDonors"
import { donorSchema, isEligibleQuerySchema } from "../schemas/donors"
import { bloodTypeSchema } from "../schemas/bloodType"

export const donors: FastifyPluginAsyncZod = async (app) => {
	app.addHook("onRequest", app.authenticate)

	const getDonorsController = container.get<GetDonorsController>(
		TYPES.GetDonorsController,
	)

	app.get(
		"/api/donors",
		{
			schema: {
				summary: "List donors",
				tags: ["Donors"],
				security: [{ cookieAuth: [] }],
				querystring: paginationQuerySchema.extend({
					bloodType: bloodTypeSchema.optional(),
					isEligible: isEligibleQuerySchema,
				}),
				response: {
					200: apiResponseSchema(pagedListSchema(donorSchema)),
					400: apiErrorSchema,
					401: apiErrorSchema,
				},
			},
		},
		(req, rep) => getDonorsController.handle(req, rep),
	)
}
