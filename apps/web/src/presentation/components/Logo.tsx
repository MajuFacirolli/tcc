import { Droplets } from "lucide-react"

export const Logo = () => {
	return (
		<div className="flex items-center justify-center gap-2">
			<Droplets className="w-5 h-5 text-red-800 fill-red-800" />
			<span className="text-sm font-semibold tracking-tight">HemoConnect</span>
		</div>
	)
}
