import { PagesEnum } from "@/presentation/enums/PagesEnum"
import { useRouter } from "@tanstack/react-router"
import { useForm } from "react-hook-form"

type LoginFields = {
	email: string
	password: string
}

export const useLoginForm = () => {
	const { register, handleSubmit } = useForm<LoginFields>()
	const router = useRouter()

	function handleLoginSubmit(data: unknown) {
		console.log(data)
		localStorage.setItem("isAuthenticated", "true")
		router.navigate({ to: PagesEnum.HOME })
	}

	return {
		handleSubmit: handleSubmit(handleLoginSubmit),
		register,
	}
}
