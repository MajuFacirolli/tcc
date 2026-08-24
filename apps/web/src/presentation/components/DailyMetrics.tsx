import { Mails, Megaphone, TrendingUp, UserCheck, Users } from "lucide-react"
import { Card } from "@/presentation/components/ui/Card"
import { formatInteger } from "@/presentation/utils/formatMetrics"
import { Badge } from "./ui/Badge"
import { useDailyMetrics } from "../hooks/useDailyMetrics"
import { DailyMetricsSkeleton } from "./skeletons/DailyMetricsSkeleton"

const cardClassName =
	"flex-row items-center gap-4 p-4 transition-opacity duration-150 in-data-[fetching=true]:opacity-60"

export const DailyMetrics = () => {
	const { dailyMetrics, error, isFetching, isLoading } = useDailyMetrics()

	return (
		<section className="flex flex-col gap-6">
			<h3 className="typography-overline">Indicadores do dia</h3>

			{!isLoading && error && (
				<div className="py-16 text-center">
					<p className="text-sm text-zinc-500">
						Não foi possível carregar os indicadores do dia.
					</p>
				</div>
			)}

			{!error && (
				<div
					data-fetching={isFetching}
					aria-busy={isFetching}
					className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
				>
					{isLoading && <DailyMetricsSkeleton />}

					{!isLoading && dailyMetrics && (
						<>
							<Card className={cardClassName}>
								<Card.Icon Icon={Users} size="lg" color="accent" />
								<div>
									<Card.Title className="text-2xl font-bold">
										{formatInteger(dailyMetrics.registeredDonors)}
									</Card.Title>
									<Card.Description className="text-zinc-900">
										Doadores cadastrados
									</Card.Description>
								</div>
							</Card>

							<Card className={cardClassName}>
								<Card.Icon Icon={UserCheck} size="lg" color="accent" />
								<div>
									<Card.Title className="text-2xl font-bold">
										{formatInteger(dailyMetrics.eligibleDonors)}
									</Card.Title>
									<Card.Description className="text-zinc-900">
										Elegíveis agora
									</Card.Description>
								</div>
							</Card>

							<Card className={cardClassName}>
								<Card.Icon Icon={Megaphone} size="lg" color="accent" />
								<div>
									<div className="flex items-center gap-4">
										<Card.Title className="text-2xl font-bold">
											{formatInteger(dailyMetrics.activeCampaigns)}
										</Card.Title>
										{dailyMetrics.confirmationsToday > 0 && (
											<Badge variant="success">
												<TrendingUp data-icon="inline-start" />
												{formatInteger(dailyMetrics.confirmationsToday)}{" "}
												confirmações
											</Badge>
										)}
									</div>
									<p className="text-sm">Campanhas ativas</p>
								</div>
							</Card>

							<Card className={cardClassName}>
								<Card.Icon Icon={Mails} size="lg" color="accent" />
								<div>
									<Card.Title className="text-2xl font-bold">
										{formatInteger(dailyMetrics.notificationsSentToday)}
									</Card.Title>
									<Card.Description className="text-zinc-900">
										Notificações enviadas
									</Card.Description>
								</div>
							</Card>
						</>
					)}
				</div>
			)}
		</section>
	)
}
