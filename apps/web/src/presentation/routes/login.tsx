import { useLoginForm } from "@/presentation/hooks/useLoginForm"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { Droplets } from "lucide-react"

export const Route = createFileRoute("/login")({
	beforeLoad: () => {
		if (localStorage.getItem("isAuthenticated")) {
			throw redirect({ to: "/" })
		}
	},
	component: LoginPage,
})

function LoginPage() {
	const { handleSubmit, register } = useLoginForm()

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
				<div className="space-y-1.5">
					<label htmlFor="email" className="text-sm font-medium text-zinc-700">
						E-mail
					</label>
					<input
						{...register("email")}
						type="email"
						placeholder="seu@email.com"
						className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent aria-invalid:border-red-400 aria-invalid:focus:ring-red-400"
					/>
				</div>

				<div className="space-y-1.5">
					<label
						htmlFor="password"
						className="text-sm font-medium text-zinc-700"
					>
						Senha
					</label>
					<input
						{...register("password")}
						type="password"
						placeholder="••••••••"
						className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent aria-invalid:border-red-400 aria-invalid:focus:ring-red-400"
					/>
				</div>

				<button
					type="submit"
					className="w-full rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white hover:bg-red-900 transition-colors duration-150"
				>
					Entrar
				</button>
			</form>
		</div>
	)
}
