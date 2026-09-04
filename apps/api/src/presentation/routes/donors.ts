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
import type { GetDonorsController } from "@/presentation/controllers/donors/GetDonors"
import type { CountEligibleDonorsController } from "@/presentation/controllers/donors/CountEligibleDonors"
import { donorSchema, isEligibleQuerySchema } from "../schemas/donors"
import { bloodTypeSchema } from "../schemas/bloodType"

export const donors: FastifyPluginAsyncZod = async (app) => {
	app.addHook("onRequest", app.authenticate)

	const getDonorsController = container.get<GetDonorsController>(
		TYPES.GetDonorsController,
	)
	const countEligibleDonorsController =
		container.get<CountEligibleDonorsController>(
			TYPES.CountEligibleDonorsController,
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

	app.get(
		"/api/donors/eligible-count",
		{
			schema: {
				summary: "Count eligible donors by blood type",
				tags: ["Donors"],
				security: [{ cookieAuth: [] }],
				querystring: z.object({ bloodType: bloodTypeSchema }),
				response: {
					200: apiResponseSchema(z.object({ total: z.number() })),
					400: apiErrorSchema,
					401: apiErrorSchema,
				},
			},
		},
		(req, rep) => countEligibleDonorsController.handle(req, rep),
	)
}
