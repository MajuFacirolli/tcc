import type { FastifyInstance } from "fastify"
import { buildApp } from "@/app"
import { AUTH_COOKIE_NAME } from "@presentation/middlewares/authCookie"

export const TEST_USER = {
	sub: "01932b8e-0000-7000-8000-0000000000ff",
	email: "admin@hemoconnect.dev",
}

export function buildTestApp() {
	return buildApp()
}

export async function authCookie(
	app: FastifyInstance,
	payload: { sub: string; email: string } = TEST_USER,
) {
	await app.ready()
	return { [AUTH_COOKIE_NAME]: app.jwt.sign(payload) }
}
