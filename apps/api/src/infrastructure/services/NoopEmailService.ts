import type { SendEmailInput } from "@/application/dtos/services/SendEmailInput"
import type { IEmailService } from "@application/interfaces/IEmailService"

/**
 * Accepts a message and delivers it nowhere.
 *
 * Selected by `EMAIL_TRANSPORT=noop`, which the end-to-end run uses: the donor base is
 * synthetic, so there is nobody to write to, and a test must never reach a real SMTP
 * server. Everything upstream — the token, the rendered body, the notification count —
 * still happens through the ordinary code path.
 */
export class NoopEmailService implements IEmailService {
	async send(_input: SendEmailInput): Promise<void> {}
}
