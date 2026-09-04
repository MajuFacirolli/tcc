import { z } from "zod"

export const signInBodySchema = z.object({
	email: z.email().max(254),
	password: z.string().min(1).max(128),
})

export const authUserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.email(),
})
