import { Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { Heading } from "@/components/Heading"
import { PagesEnum } from "@/enums/PagesEnum"

export const NotFound = () => (
	<div className="flex flex-col gap-2 items-center justify-center">
		<Heading className="items-center">
			<Heading.Overline>Erro 404</Heading.Overline>
			<Heading.Title>Página não econtrada</Heading.Title>
			<Heading.Description className="text-zinc-600">
				O endereço que você tentou acessar não existe ou foi movido.
			</Heading.Description>
		</Heading>
		<Link
			to={PagesEnum.HOME}
			className="uppercase text-sm flex items-center gap-1 text-red-800 hover:text-red-700 transition-all duration-150"
		>
			<ArrowLeft className="size-4" />
			Voltar ao início
		</Link>
	</div>
)
