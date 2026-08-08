import { PagesEnum } from "@/presentation/enums/PagesEnum"
import { useRouter } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { signInSchema, type SignInSchema } from "../schemas/signInSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createSignInCommand } from "@/factories/createSignInCommand"
import { QUERY_KEYS } from "../data/queryKeys"
import { useErrors } from "./useErrors"

const signInCommand = createSignInCommand()

export const useLoginForm = () => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { isSubmitting, errors },
	} = useForm<SignInSchema>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	})

	const { handleError } = useErrors({
		setError,
		fields: ["email", "password"],
	})

	const router = useRouter()
	const queryClient = useQueryClient()

	async function handleLoginSubmit(data: SignInSchema) {
		const response = await signInCommand.execute({
			email: data.email,
			password: data.password,
		})

		if (response.isLeft()) {
			handleError(response.value)
			return
		}

		queryClient.setQueryData([QUERY_KEYS.PROFILE], response.value)

		router.navigate({ to: PagesEnum.HOME })
	}

	return {
		handleSubmit: handleSubmit(handleLoginSubmit),
		register,
		isSubmitting,
		errors,
	}
}
