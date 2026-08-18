import { NewCampaignForm } from "@/presentation/components/forms/NewCampaignForm"
import { Preview } from "@/presentation/components/forms/NewCampaignForm/Preview"
import { Button } from "@/presentation/components/ui/Button"
import { Heading } from "@/presentation/components/ui/Heading"
import { PagesEnum } from "@/presentation/enums/PagesEnum"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"

export const Route = createFileRoute("/_dashboard/campanhas/nova")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-10">
			<Heading className="items-start">
				<Heading.Title level="h1">Nova Campanha</Heading.Title>
				<Heading.Description>
					Preencha as informações e dispare a comunicação
				</Heading.Description>
				<Button variant="ghost" className="p-0" asChild>
					<Link to={PagesEnum.CAMPAIGNS}>
						<ArrowLeft />
						Voltar
					</Link>
				</Button>
			</Heading>

			<div className="w-full lg:flex gap-15 items-start">
				<section className="w-full lg:max-w-lg">
					<NewCampaignForm />
				</section>
				<aside className="w-full flex flex-col gap-4">
					<Heading.Title level="h2" className="text-lg">
						Preview
					</Heading.Title>
					<Preview />
				</aside>
			</div>
		</div>
	)
}
