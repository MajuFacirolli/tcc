import { timingSafeEqual } from "node:crypto"
import type { FastifyReply, FastifyRequest } from "fastify"
import HttpStatusCode from "@/core/StatusCodesEnum"
import { env } from "@/env"

export type DashboardCredentials = {
	user: string
	password: string
}

const BASIC_PREFIX = "basic "

const WWW_AUTHENTICATE = 'Basic realm="HemoConnect queues", charset="UTF-8"'

export function resolveDashboardCredentials(): DashboardCredentials | null {
	if (!env.DASHBOARD_USER || !env.DASHBOARD_PASSWORD) return null

	return { user: env.DASHBOARD_USER, password: env.DASHBOARD_PASSWORD }
}

function matches(provided: string, expected: string): boolean {
	const left = Buffer.from(provided, "utf8")
	const right = Buffer.from(expected, "utf8")

	if (left.length !== right.length) return false

	return timingSafeEqual(left, right)
}

function decodeBasicHeader(header: string | undefined): string | null {
	if (!header?.toLowerCase().startsWith(BASIC_PREFIX)) return null

	return Buffer.from(header.slice(BASIC_PREFIX.length), "base64").toString(
		"utf8",
	)
}

export function dashboardBasicAuth({ user, password }: DashboardCredentials) {
	const expected = `${user}:${password}`

	return async (request: FastifyRequest, reply: FastifyReply) => {
		const provided = decodeBasicHeader(request.headers.authorization)

		if (!provided || !matches(provided, expected)) {
			return reply
				.header("WWW-Authenticate", WWW_AUTHENTICATE)
				.status(HttpStatusCode.UNAUTHORIZED)
				.send({
					data: null,
					status: HttpStatusCode.UNAUTHORIZED,
					message: "Dashboard credentials required",
				})
		}
	}
}
