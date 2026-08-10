import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import type { QueryClient } from "@tanstack/react-query"
import { NuqsAdapter } from "nuqs/adapters/tanstack-router"
import { NotFound } from "@/presentation/components/404"
import { InternalServerError } from "@/presentation/components/500"

const MainLayout = () => (
	<NuqsAdapter>
		<main className="flex items-center justify-center w-full h-dvh">
			<Outlet />
			{/* <TanStackRouterDevtools /> */}
		</main>
	</NuqsAdapter>
)

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
	{
		component: MainLayout,
		notFoundComponent: NotFound,
		errorComponent: InternalServerError,
	},
)
