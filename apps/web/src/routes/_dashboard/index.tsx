import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/")({
	component: Index,
})

function Index() {
	return <div>Dashboard</div>
}
