import { createFileRoute, Outlet } from "@tanstack/react-router"
import { Sidebar } from "../components/Sidebar"

const DashboardLayout = () => (
	<div className="flex w-full h-dvh bg-zinc-100">
		<Sidebar />
		<div className="flex-1 overflow-auto pl-23">
			<Outlet />
		</div>
	</div>
)

export const Route = createFileRoute("/_dashboard")({
	component: DashboardLayout,
})
