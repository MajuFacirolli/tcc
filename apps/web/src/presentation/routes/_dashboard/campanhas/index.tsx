import { CampaignsList } from "@/presentation/components/CampaignsList"
import { Heading } from "@/presentation/components/ui/Heading"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/campanhas/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-10">
			<Heading>
				<Heading.Title>Campanhas</Heading.Title>
				<Heading.Description>
					Histórico de comunicações ativas e enviadas
				</Heading.Description>
			</Heading>

			<CampaignsList />
		</div>
	)
}
