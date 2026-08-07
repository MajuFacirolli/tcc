import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { Sidebar } from "../components/Sidebar"

const DashboardLayout = () => (
	<div className="flex w-full h-dvh bg-zinc-100">
		<Sidebar />
		<div className="flex-1 overflow-auto pb-16 lg:pb-0 lg:pl-17.5">
			<Outlet />
		</div>
	</div>
)

export const Route = createFileRoute("/_dashboard")({
	beforeLoad: () => {
		if (!localStorage.getItem("isAuthenticated")) {
			throw redirect({ to: "/login" })
		}
	},
	component: DashboardLayout,
})
