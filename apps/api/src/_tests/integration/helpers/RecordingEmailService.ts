import type { SendEmailInput } from "@/application/dtos/services/SendEmailInput"
import type { IEmailService } from "@application/interfaces/IEmailService"

/**
 * Stands in for the SMTP transport and keeps what would have been sent, so the
 * assembled message can be asserted. The template renderer is left real — the point of
 * the dispatch criterion is that the actual e-mail body is built correctly.
 */
export class RecordingEmailService implements IEmailService {
	readonly sent: SendEmailInput[] = []

	async send(input: SendEmailInput): Promise<void> {
		this.sent.push(input)
	}

	find(to: string) {
		return this.sent.find((message) => message.to === to)
	}

	clear() {
		this.sent.length = 0
	}
}
