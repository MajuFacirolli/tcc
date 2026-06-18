import { z } from "zod"

export function apiResponseSchema<T>(dataSchema: T) {
	return z.object({
		data: dataSchema,
		status: z.number(),
		message: z.string().optional(),
	})
}

export const apiErrorSchema = z.object({
	data: z.null(),
	status: z.number(),
	message: z.string(),
})
