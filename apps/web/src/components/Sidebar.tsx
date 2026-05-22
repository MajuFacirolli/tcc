import { Link } from "@tanstack/react-router"
import clsx from "clsx"
import { CircleQuestionMark, LogOut } from "lucide-react"
import { SHORTCUT_LINKS } from "../data/shortcutLinks"
import { PagesEnum } from "../enums/PagesEnum"
import { Tooltip } from "./Tooltip"

export const Sidebar = () => {
	return (
		<aside className="fixed left-4 top-1/2 -translate-y-1/2 bg-white rounded-lg py-4 px-2 shadow-sm">
			<nav className="flex flex-col gap-2">
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
			<div className="border-t border-zinc-200 mt-3 pt-3 flex flex-col items-center gap-2">
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

				<div className="bg-zinc-100 text-zinc-950 border border-zinc-200 rounded-full size-8 flex items-center justify-center">
					<span className=" text-center text-xs font-bold leading-none">
						AD
					</span>
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
