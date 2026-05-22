import { Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { Heading } from "@/components/Heading"
import { PagesEnum } from "@/enums/PagesEnum"

export const InternalServerError = () => {
	return (
		<div className="flex flex-col gap-2 items-center justify-center h-dvh">
			<Heading className="items-center">
				<Heading.Overline>Erro 500</Heading.Overline>
				<Heading.Title>Internal Server Error</Heading.Title>
				<Heading.Description className="text-zinc-600">
					Ocorreu um erro inesperado
				</Heading.Description>
			</Heading>
			<Link
				to={PagesEnum.HOME}
				className="uppercase text-sm flex items-center gap-1 text-red-800 hover:text-red-700 transition-all duration-150"
			>
				<ArrowLeft className="size-4" />
				Tentar voltar ao início
			</Link>
		</div>
	)
}
