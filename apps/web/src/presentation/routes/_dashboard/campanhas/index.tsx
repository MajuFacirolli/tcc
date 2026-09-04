import { CampaignsList } from "@/presentation/components/CampaignsList"
import { Button } from "@/presentation/components/ui/Button"
import { Heading } from "@/presentation/components/ui/Heading"
import { PagesEnum } from "@/presentation/enums/PagesEnum"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Plus } from "lucide-react"

export const Route = createFileRoute("/_dashboard/campanhas/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-10">
			<Heading>
				<Heading.Title>Campanhas</Heading.Title>
				<div className="flex items-center justify-between gap-2">
					<Heading.Description>
						Histórico de comunicações ativas e enviadas
					</Heading.Description>
					<Button size="default" asChild>
						<Link to={PagesEnum.NEW_CAMPAIGN} className="relative group">
							<Plus className="size-4.5" />
							Nova campanha
						</Link>
					</Button>
				</div>
			</Heading>

			<CampaignsList />
		</div>
	)
}
