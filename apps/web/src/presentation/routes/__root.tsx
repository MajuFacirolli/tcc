import { createRootRoute, Outlet } from "@tanstack/react-router"
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { NotFound } from "@/presentation/components/404"
import { InternalServerError } from "@/presentation/components/500"

const MainLayout = () => (
	<main className="flex items-center justify-center w-full h-dvh">
		<Outlet />
		{/* <TanStackRouterDevtools /> */}
	</main>
)

export const Route = createRootRoute({
	component: MainLayout,
	notFoundComponent: NotFound,
	errorComponent: InternalServerError,
})
