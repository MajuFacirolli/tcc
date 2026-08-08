import { createFileRoute } from "@tanstack/react-router"
import { BloodBankSummary } from "@/presentation/components/BloodBankSummary"
import { DailyMetrics } from "@/presentation/components/DailyMetrics"
import { Heading } from "@/presentation/components/ui/Heading"
import { RecentCampaigns } from "@/presentation/components/RecentCampaigns"

export const Route = createFileRoute("/_dashboard/")({
	component: Index,
})

function Index() {
	return (
		<div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-10">
			<Heading>
				<Heading.Overline>Visão Geral</Heading.Overline>
				<Heading.Title>Painel Administrativo</Heading.Title>
				<Heading.Description>
					Acompanhe em tempo real o estoque de sangue, os doadores elegíveis e o
					desempenho das campanhas ativas.
				</Heading.Description>
			</Heading>

			<DailyMetrics />

			<div className="grid md:grid-cols-12 gap-y-10 gap-x-4">
				<BloodBankSummary />
				<RecentCampaigns />
			</div>
		</div>
	)
}
