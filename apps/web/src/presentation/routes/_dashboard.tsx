import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { PagesEnum } from "@/presentation/enums/PagesEnum"
import { profileQueryOptions } from "@/presentation/queries/profileQuery"
import { Sidebar } from "../components/Sidebar"

const DashboardLayout = () => {
	const { profile } = Route.useRouteContext()

	return (
		<div className="flex w-full h-dvh bg-zinc-100">
			<Sidebar profile={profile} />
			<div className="flex-1 overflow-auto pb-16 lg:pb-0 lg:pl-17.5">
				<Outlet />
			</div>
		</div>
	)
}

export const Route = createFileRoute("/_dashboard")({
	beforeLoad: async ({ context }) => {
		const profile = await context.queryClient
			.ensureQueryData(profileQueryOptions)
			.catch(() => null)

		if (!profile) {
			throw redirect({ to: PagesEnum.LOGIN })
		}

		return { profile }
	},
	component: DashboardLayout,
})
