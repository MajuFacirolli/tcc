import { Mails, Megaphone, TrendingUp, UserCheck, Users } from "lucide-react"
import { Card } from "@/presentation/components/Card"
import { Badge } from "./Badge"

export const DailyMetrics = () => {
	return (
		<section className="flex flex-col gap-6">
			<h3 className="typography-overline">Indicadores do dia</h3>
			<div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				<Card className="flex-row items-center gap-4 p-4">
					<Card.Icon Icon={Users} size="lg" color="accent" />
					<div>
						<Card.Title className="text-2xl font-bold">835</Card.Title>
						<Card.Description className="text-zinc-900">
							Doadores cadastrados
						</Card.Description>
					</div>
				</Card>

				<Card className="flex-row items-center gap-4 p-4">
					<Card.Icon Icon={UserCheck} size="lg" color="accent" />
					<div>
						<Card.Title className="text-2xl font-bold">520</Card.Title>
						<Card.Description className="text-zinc-900">
							Elegíveis agora
						</Card.Description>
					</div>
				</Card>

				<Card className="flex-row items-center gap-4 p-4">
					<Card.Icon Icon={Megaphone} size="lg" color="accent" />
					<div>
						<div className="flex items-center gap-4">
							<Card.Title className="text-2xl font-bold">4</Card.Title>
							<Badge variant="success">
								<TrendingUp data-icon="inline-start" />
								31 confirmações
							</Badge>
						</div>
						<p className="text-sm">Campanhas ativas</p>
					</div>
				</Card>

				<Card className="flex-row items-center gap-4 p-4">
					<Card.Icon Icon={Mails} size="lg" color="accent" />
					<div>
						<Card.Title className="text-2xl font-bold">68</Card.Title>
						<Card.Description className="text-zinc-900">
							Notificações enviadas
						</Card.Description>
					</div>
				</Card>
			</div>
		</section>
	)
}
