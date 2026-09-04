import type { CookieSerializeOptions } from "@fastify/cookie"
import { env } from "@/env"

export const AUTH_COOKIE_NAME = "hemoconnect_session"

export const authCookieOptions: CookieSerializeOptions = {
	httpOnly: true,
	sameSite: "lax",
	secure: env.NODE_ENV === "production",
	path: "/",
	maxAge: env.SESSION_DURATION,
}
