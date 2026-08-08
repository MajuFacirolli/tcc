import { useLoginForm } from "@/presentation/hooks/useLoginForm"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { Droplets, Loader } from "lucide-react"
import { Button } from "@/presentation/components/ui/Button"
import {
	Field,
	FieldError,
	FieldLabel,
} from "@/presentation/components/ui/Field"
import { Input } from "@/presentation/components/ui/Input"
import { profileQueryOptions } from "@/presentation/queries/profileQuery"
import { PagesEnum } from "../enums/PagesEnum"

export const Route = createFileRoute("/login")({
	beforeLoad: async ({ context }) => {
		const profile = await context.queryClient
			.ensureQueryData(profileQueryOptions)
			.catch(() => null)

		if (profile) {
			throw redirect({ to: PagesEnum.HOME })
		}
	},
	component: LoginPage,
})

function LoginPage() {
	const { handleSubmit, register, errors, isSubmitting } = useLoginForm()

	return (
		<div className="w-full max-w-sm px-6 flex flex-col gap-6">
			<div className="flex flex-col gap-6">
				<div className="flex items-center justify-center gap-2">
					<Droplets className="w-5 h-5 text-red-800 fill-red-800" />
					<span className="text-sm font-semibold tracking-tight">
						HemoConnect
					</span>
				</div>
				<div>
					<h1 className="text-2xl font-bold text-zinc-900">Acesso ao Painel</h1>
					<p className="text-sm text-zinc-500">
						Insira suas credenciais para continuar.
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				<FieldError
					errors={errors.root ? [errors.root] : []}
					className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-center"
				/>

				<Field className="gap-1.5">
					<FieldLabel htmlFor="email">E-mail</FieldLabel>
					<Input
						{...register("email")}
						id="email"
						type="email"
						placeholder="seu@email.com"
						aria-invalid={!!errors.email}
					/>
					<FieldError errors={[errors.email]} />
				</Field>

				<Field className="gap-1.5">
					<FieldLabel htmlFor="password">Senha</FieldLabel>
					<Input
						{...register("password")}
						id="password"
						type="password"
						placeholder="••••••••"
						aria-invalid={!!errors.password}
					/>
					<FieldError errors={[errors.password]} />
				</Field>

				<Button type="submit" className="w-full" disabled={isSubmitting}>
					Entrar
					{isSubmitting && <Loader className="animate-spin" />}
				</Button>
			</form>
		</div>
	)
}
