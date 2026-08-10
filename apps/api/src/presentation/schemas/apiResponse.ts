import { z } from "zod"

export function apiResponseSchema<T>(dataSchema: T) {
	return z.object({
		data: dataSchema,
		status: z.number(),
		message: z.string().optional(),
	})
}

export function pagedListSchema<T extends z.ZodTypeAny>(itemSchema: T) {
	return z.object({
		items: z.array(itemSchema),
		page: z.number(),
		pageSize: z.number(),
		total: z.number(),
		lastPage: z.number(),
	})
}

export const apiErrorSchema = z.object({
	data: z.null(),
	status: z.number(),
	message: z.string(),
})
