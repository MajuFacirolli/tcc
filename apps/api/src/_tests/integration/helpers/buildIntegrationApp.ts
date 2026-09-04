import { buildApp } from "@/app"
import { container } from "@/container/Ioc.config"

/**
 * The only sanctioned way to build the app in the integration lane.
 *
 * `presentation/routes/campaigns.ts` and `routes/confirmations.ts` resolve their
 * controllers from the container when the plugin is *registered*, so a rebind applied
 * after `buildApp()` — or after the `app.ready()` that `authCookie` awaits — arrives
 * too late and is silently ignored. Encoding the order here keeps every test from
 * having to remember it.
 */
export function buildIntegrationApp(
	rebinds: Array<[symbol, unknown]> = [],
): ReturnType<typeof buildApp> {
	for (const [signature, value] of rebinds)
		container.rebindToValue(signature, value)

	return buildApp()
}
