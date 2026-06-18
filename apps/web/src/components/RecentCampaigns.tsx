import { Link } from "@tanstack/react-router"
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { PagesEnum } from "@/enums/PagesEnum"

const mockCampaigns = [
	{
		title: "Urgência O-",
		type: "O-",
		conversionRate: 70,
		notifiedCount: 30,
	},
	{
		title: "Urgência B-",
		type: "B-",
		conversionRate: 62,
		notifiedCount: 48,
	},
	{
		title: "Urgência O+",
		type: "O+",
		conversionRate: 25,
		notifiedCount: 23,
	},
]

export const RecentCampaigns = () => {
	return (
		<aside className="col-span-6 flex flex-col gap-6">
			<div className="w-full flex items-center justify-between">
				<h3 className="typography-overline">Campanhas recentes</h3>
				<Link
					to={PagesEnum.CAMPAIGNS}
					className="uppercase text-xs flex items-center gap-1 text-red-800 hover:text-red-700 transition-all duration-150"
				>
					Ver todas
					<ArrowRight className="size-4" />
				</Link>
			</div>

			<div className="bg-white shadow-sm rounded-lg divide-y divide-zinc-300">
				{mockCampaigns.map((campaign) => (
					<div
						key={campaign.type}
						className="px-5 py-4 flex items-center justify-between transition-colors"
					>
						<div className="min-w-0 flex-1 pr-4">
							<p className="text-sm font-medium truncate">{campaign.title}</p>
							<div className="flex items-center gap-2 mt-1">
								<span className="text-xs font-semibold border border-zinc-300 text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
									{campaign.type}
								</span>
								<span className="text-xs text-zinc-500">
									{campaign.notifiedCount} notificados
								</span>
							</div>
						</div>
						<div className="text-right shrink-0">
							<div
								className={twMerge(
									"flex items-center justify-end gap-1 text-sm font-semibold ",
									campaign.conversionRate >= 50
										? "text-emerald-700"
										: "text-red-600",
								)}
							>
								{campaign.conversionRate >= 50 ? (
									<TrendingUp className="w-3.5 h-3.5" />
								) : (
									<TrendingDown className="w-3.5 h-3.5" />
								)}
								{campaign.conversionRate.toFixed(1)}%
							</div>
							<p className="text-xs text-zinc-500">conversão</p>
						</div>
					</div>
				))}
			</div>
		</aside>
	)
}
