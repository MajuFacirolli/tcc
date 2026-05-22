import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

const MainLayout = () => (
	<main className="flex items-center justify-center w-full h-dvh">
		<Outlet />
		{/* <TanStackRouterDevtools /> */}
	</main>
)

export const Route = createRootRoute({ component: MainLayout })
