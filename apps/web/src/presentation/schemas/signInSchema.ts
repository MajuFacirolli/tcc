import { z } from "zod"

export const signInSchema = z.object({
	email: z.email("Informe seu e-mail"),
	password: z.string().min(1, "Informe sua senha"),
})

export type SignInSchema = z.infer<typeof signInSchema>
