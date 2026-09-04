import { Logo } from "@/presentation/components/Logo"
import { Button } from "@/presentation/components/ui/Button"
import { Heading } from "@/presentation/components/ui/Heading"
import { useConfirmDonationIntention } from "@/presentation/hooks/useConfirmDonationIntention"
import { formatDateTime } from "@/utils/formatDate"
import { createFileRoute } from "@tanstack/react-router"
import { CircleAlert, CircleCheck, Loader } from "lucide-react"

const SCHEDULE_URL = import.meta.env?.VITE_SCHEDULE_URL ?? ""

export const Route = createFileRoute("/confirmacoes/$token")({
	component: RouteComponent,
})

function RouteComponent() {
	const { token } = Route.useParams()
	const { confirmedAt, isLoading, isInvalidToken, hasError } =
		useConfirmDonationIntention(token)

	return (
		<div className="flex flex-col gap-6 items-center px-6">
			<Logo />

			{isLoading && (
				<div className="flex flex-col gap-3 items-center">
					<Loader className="size-8 text-zinc-400 animate-spin" />
					<Heading className="items-center text-center max-w-lg">
						<Heading.Title level="h1">
							Confirmando sua intenção de doar...
						</Heading.Title>
						<Heading.Description className="text-base">
							Aguarde um instante enquanto registramos sua resposta.
						</Heading.Description>
					</Heading>
				</div>
			)}

			{!isLoading && confirmedAt && (
				<div className="flex flex-col gap-3 items-center">
					<CircleCheck className="size-8 text-green-700" />
					<Heading className="items-center text-center max-w-lg">
						<Heading.Title level="h1">Intenção confirmada!</Heading.Title>
						<Heading.Description className="text-base">
							Registramos sua intenção de doar em {formatDateTime(confirmedAt)}.
							Obrigado por apoiar esta campanha.
						</Heading.Description>
					</Heading>

					<Button asChild>
						<a href={SCHEDULE_URL} target="_blank" rel="noreferrer">
							Agendar horário
						</a>
					</Button>

					<div className="w-full max-w-sm text-center text-xs p-2 text-zinc-600">
						Esta confirmação representa uma intenção de doação e não substitui o
						agendamento de horários realizado pelo hemocentro.
					</div>
				</div>
			)}

			{!isLoading && hasError && (
				<div className="flex flex-col gap-3 items-center">
					<CircleAlert className="size-8 text-red-800" />
					<Heading className="items-center text-center max-w-lg">
						<Heading.Title level="h1">
							{isInvalidToken ? "Link inválido" : "Não foi possível confirmar"}
						</Heading.Title>
						<Heading.Description className="text-base">
							{isInvalidToken
								? "Este link de confirmação não existe. Verifique o e-mail que você recebeu do hemocentro."
								: "Ocorreu um erro inesperado ao registrar sua intenção. Tente novamente mais tarde."}
						</Heading.Description>
					</Heading>
				</div>
			)}
		</div>
	)
}
