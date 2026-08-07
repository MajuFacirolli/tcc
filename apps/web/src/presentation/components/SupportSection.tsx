import { Mail, Phone } from "lucide-react"
import { Card } from "@/presentation/components/Card"

export const SupportSection = () => {
	return (
		<section className="flex flex-col gap-6">
			<h3 className="typography-overline">Fale com o suporte</h3>
			<div className="flex flex-col sm:flex-row items-center gap-4 max-w-xl">
				<Card className="gap-2">
					<div className="flex gap-2">
						<Card.Icon Icon={Mail} />
						<div>
							<Card.Title>E-mail</Card.Title>
							<Card.Description className="text-xs">
								Resposta em até 24h úteis
							</Card.Description>
						</div>
					</div>
					<Card.Description className="text-red-800! font-semibold">
						suporte@hemoconnect.com.br
					</Card.Description>
				</Card>
				<Card className="gap-2">
					<div className="flex gap-2">
						<Card.Icon Icon={Phone} />
						<div>
							<Card.Title>Telefone</Card.Title>
							<Card.Description className="text-xs">
								Seg a Sex, das 8h às 18h
							</Card.Description>
						</div>
					</div>
					<Card.Description className="text-red-800! font-semibold">
						(16) 3000-0000
					</Card.Description>
				</Card>
			</div>

			<span className="text-xs text-center text-zinc-500">
				Sistema acadêmico — dados simulados. Nenhum contato acima é operacional.
			</span>
		</section>
	)
}
