import { DonorsTable } from "@/presentation/components/DonorsTable"
import { Heading } from "@/presentation/components/ui/Heading"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/doadores")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-10">
			<Heading>
				<Heading.Title>Doadores</Heading.Title>
				<Heading.Description>
					Cadastro de doadores e sua aptidão para novas doações
				</Heading.Description>
			</Heading>

			<DonorsTable />
		</div>
	)
}
