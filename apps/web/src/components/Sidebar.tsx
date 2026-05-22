import { Link } from "@tanstack/react-router"
import clsx from "clsx"
import { CircleQuestionMark, LogOut } from "lucide-react"
import { Tooltip } from "@/components/Tooltip"
import { SHORTCUT_LINKS } from "@/data/shortcutLinks"
import { PagesEnum } from "@/enums/PagesEnum"

export const Sidebar = () => {
	return (
		<aside
			className={clsx(
				"fixed z-50 bg-white shadow-sm",
				"bottom-0 left-0 right-0 rounded-t-lg py-2 px-4 flex flex-row items-center justify-center",
				"lg:bottom-auto lg:left-4 lg:right-auto lg:top-1/2 lg:-translate-y-1/2 lg:rounded-lg lg:py-4 lg:px-2 lg:flex-col",
			)}
		>
			<nav className="flex flex-row gap-2 lg:flex-col">
				{SHORTCUT_LINKS.map((item) => (
					<Link
						key={item.path}
						to={item.path}
						className={clsx(
							"group flex items-center justify-center gap-3 p-2.5 rounded-lg text-sm font-medium text-zinc-500",
							"hover:text-red-800 hover:bg-red-50 transition-colors duration-150",
							"[&.active]:bg-red-800 [&.active]:text-white",
						)}
					>
						<item.icon className="size-4.5" />
						<Tooltip label={item.label} />
					</Link>
				))}
			</nav>
			<div className="border-l border-zinc-200 ml-3 pl-3 flex flex-row items-center gap-1 lg:border-l-0 lg:border-t lg:ml-0 lg:pl-0 lg:mt-3 lg:pt-3 lg:flex-col lg:gap-2">
				<Link
					to={PagesEnum.HELP}
					className={clsx(
						"group flex items-center justify-center gap-3 p-2.5 rounded-lg text-sm font-medium text-zinc-500",
						"hover:text-red-800 hover:bg-red-50 transition-colors duration-150",
						"[&.active]:bg-red-800 [&.active]:text-white",
					)}
				>
					<CircleQuestionMark className="size-4.5" />
					<Tooltip label="Ajuda" />
				</Link>

				<div className="hidden lg:flex bg-zinc-100 text-zinc-950 border border-zinc-200 rounded-full size-8 items-center justify-center">
					<span className="text-center text-xs font-bold leading-none">AD</span>
				</div>

				<button
					type="button"
					className={clsx(
						"group flex items-center justify-center gap-3 p-2.5 rounded-lg text-sm font-medium text-zinc-500",
						"hover:text-red-800 hover:bg-red-50 transition-colors duration-150",
					)}
				>
					<LogOut className="size-4.5" />
					<Tooltip label="Sair" />
				</button>
			</div>
		</aside>
	)
}
