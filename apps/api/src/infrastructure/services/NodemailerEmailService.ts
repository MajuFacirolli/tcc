import nodemailer, { type Transporter } from "nodemailer"
import type { IEmailService } from "@application/interfaces/IEmailService"
import type { SendEmailInput } from "@/application/dtos/services/SendEmailInput"
import { env } from "@/env"

export class NodemailerEmailService implements IEmailService {
	private transporter: Transporter

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: env.SMTP_HOST,
			port: env.SMTP_PORT,
			secure: env.SMTP_PORT === 465,
			auth: {
				user: env.SMTP_USER,
				pass: env.SMTP_PASS,
			},
		})
	}

	async send({ to, subject, html, text }: SendEmailInput): Promise<void> {
		await this.transporter.sendMail({
			from: env.SMTP_FROM,
			to,
			subject,
			html,
			text,
		})
	}
}
