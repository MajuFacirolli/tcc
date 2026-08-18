import {
	Body,
	Button,
	Column,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components"

type CampaignInvitationEmailProps = {
	campaignTitle: string
	message: string
	confirmationLink: string
	companyName?: string
}

export function CampaignInvitationEmail({
	campaignTitle,
	message,
	confirmationLink,
	companyName = "HemoConnect",
}: CampaignInvitationEmailProps) {
	return (
		<Tailwind>
			<Html lang="pt-BR" dir="ltr">
				<Head />
				<Preview>
					{campaignTitle} — confirme sua intenção de doar e garanta seu horário.
				</Preview>

				<Body className="bg-zinc-200 m-0 text-center font-sans">
					<Container className="mobile:mt-0 mx-auto mt-8 w-full max-w-160">
						<Section>
							<Section className="bg-white mobile:px-2 px-6 py-4">
								{/* Cabeçalho */}
								<Section className="mb-3 px-6">
									<Row>
										<Column
											align="right"
											className="w-1/2 py-1.75 align-middle"
										>
											<Text className="font-13 m-0 text-right font-sans flex items-center gap-2">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="#991b1b"
													stroke="#991b1b"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
													aria-hidden="true"
													className="lucide lucide-droplets-icon lucide-droplets"
												>
													<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
													<path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
												</svg>
												<span className="text-fg-3">{companyName}</span>
											</Text>
										</Column>
									</Row>
								</Section>

								{/* Convite */}
								<Section className="bg-zinc-100 mobile:px-6 mobile:py-12 rounded-lg px-10 py-16 text-center">
									<Section className="mb-3">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="60"
											height="60"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#991b1b"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											aria-hidden="true"
											className="lucide lucide-droplets-icon lucide-droplets"
										>
											<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
											<path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
										</svg>

										<Heading
											as="h1"
											className="font-28 text-fg m-0 font-sans mt-3"
										>
											{campaignTitle}
										</Heading>
									</Section>

									<Text className="font-16 text-fg-2 mx-auto mt-0 mb-8 max-w-95 text-center font-sans">
										{message}
									</Text>

									<Section className="mb-4 text-center">
										<Button
											href={confirmationLink}
											className="bg-[#991b1b] font-16 text-white inline-block rounded-lg px-7 py-4 text-center font-sans leading-6"
										>
											Confirmar intenção de doar
										</Button>
									</Section>

									<Text className="font-14 text-fg-2 mx-auto mt-0 mb-8 max-w-95 text-center font-sans">
										Leva menos de um minuto. Confirmar não é compromisso
										definitivo — você pode agendar o seu horário quando quiser
									</Text>
								</Section>

								{/* Rodapé */}
								<Section className="bg-white">
									<Row>
										<Column className="px-6 py-10 text-center">
											<Text className="font-11 text-fg-3 m-0 text-center font-sans leading-4">
												Você recebeu este e-mail porque está cadastrado
												<br /> como doador na {companyName}. <br />
												<Link
													href="https://example.com/"
													className="text-fg-3 mt-2"
												>
													Gerenciar preferências ou cancelar o recebimento
												</Link>
												.
											</Text>
										</Column>
									</Row>
								</Section>
							</Section>
						</Section>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	)
}
