import { Droplets } from "lucide-react"
import { useWatch } from "react-hook-form"
import { Logo } from "../../Logo"
import { Button } from "../../ui/Button"
import { newCampaignFormControl } from "@/presentation/hooks/useNewCampaignForm"

const { control } = newCampaignFormControl

export const Preview = () => {
	const [title, message] = useWatch({
		control,
		name: ["title", "message"],
	})

	const titleDisplay = title?.trim() ? title : "[Título da campanha]"
	const messageDisplay = message?.trim() ? message : "[Conteúdo da mensagem]"

	return (
		<div className="bg-white rounded-lg shadow-sm py-4 px-6 flex flex-col items-start gap-4 overflow-hidden">
			<div className="lg:px-10 py-2">
				<Logo />
			</div>
			<div className="w-full max-w-lg mx-auto rounded-lg lg:px-10 py-16 flex flex-col items-center gap-4 text-center">
				<div className="flex flex-col items-center gap-2">
					<Droplets className="size-10 text-red-800" />
					<h3 className="text-2xl font-bold">{titleDisplay}</h3>
				</div>
				<p>{messageDisplay}</p>
				<Button className="min-h-11 text-base" type="button">
					Confirmar intenção de doar
				</Button>
				<p className="text-sm">
					Confirmar leva menos de um minuto e você ajuda o hemocentro a
					acompanhar as métricas de mobilização da campanha.
				</p>
			</div>
			<small className="w-full lg:px-10 py-4 text-sm text-center">
				<p>
					Você recebeu este e-mail porque está cadastrado <br /> como doador na
					HemoConnect.
				</p>
				<span className="text-blue-500 underline">Cancelar o recebimento</span>
			</small>
		</div>
	)
}
