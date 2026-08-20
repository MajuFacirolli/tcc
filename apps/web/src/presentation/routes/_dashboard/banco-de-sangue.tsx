import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/banco-de-sangue')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/banco-de-sangue"!</div>
}
