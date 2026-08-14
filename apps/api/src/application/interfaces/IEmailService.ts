import type { SendEmailInput } from "../dtos/services/SendEmailInput"

export interface IEmailService {
	send(input: SendEmailInput): Promise<void>
}
