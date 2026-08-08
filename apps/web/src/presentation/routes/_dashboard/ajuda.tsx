import { createFileRoute } from "@tanstack/react-router"
import { BookOpen } from "lucide-react"
import { twMerge } from "tailwind-merge"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/presentation/components/ui/Accordion"
import { Card } from "@/presentation/components/ui/Card"
import { Heading } from "@/presentation/components/ui/Heading"
import { SupportSection } from "@/presentation/components/SupportSection"
import { faqs } from "@/presentation/data/faqs"
import { guides } from "@/presentation/data/guides"

export const Route = createFileRoute("/_dashboard/ajuda")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-10">
			<Heading>
				<Heading.Overline>Suporte</Heading.Overline>
				<Heading.Title>Central de Ajuda</Heading.Title>
				<Heading.Description>
					Guias de uso, perguntas frequentes e canais de suporte.
				</Heading.Description>
			</Heading>

			<section className="flex flex-col gap-6">
				<h3 className="typography-overline">
					<BookOpen className="size-3.5" />
					Guias Rápidos
				</h3>
				<div className="grid sm:grid-cols-2 gap-4">
					{guides.map((guide) => (
						<Card key={guide.title}>
							<Card.Title level="h4">
								<Card.Icon Icon={guide.icon} />
								{guide.title}
							</Card.Title>
							<ul className="flex flex-col gap-2">
								{guide.steps.map((step, idx) => (
									<li key={step} className="flex items-center gap-2 text-sm">
										<span
											className={twMerge(
												"flex items-center justify-center rounded-full bg-zinc-100 border border-zinc-200",
												"shrink-0 size-5 text-xs font-semibold",
											)}
										>
											{idx + 1}
										</span>
										{step}
									</li>
								))}
							</ul>
						</Card>
					))}
				</div>
			</section>
			<section className="flex flex-col gap-6">
				<h3 className="typography-overline">Perguntas Frequentes</h3>
				<Accordion
					type="multiple"
					className="bg-white rounded-lg shadow-sm px-6"
				>
					{faqs.map((faq) => (
						<AccordionItem key={faq.question} value={faq.question}>
							<AccordionTrigger>{faq.question}</AccordionTrigger>
							<AccordionContent>{faq.answer}</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</section>
			<SupportSection />
		</div>
	)
}
