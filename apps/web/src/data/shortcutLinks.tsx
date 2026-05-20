import {
	ChartSpline,
	CircleQuestionMark,
	Droplets,
	House,
	type LucideProps,
	Megaphone,
	Users,
} from "lucide-react"
import { PagesEnum } from "../enums/PagesEnum"

type ShortcutLink = {
	label: string
	icon: React.ForwardRefExoticComponent<LucideProps>
	path: string
}

export const SHORTCUT_LINKS: ShortcutLink[] = [
	{
		label: "Dashboard",
		icon: House,
		path: PagesEnum.HOME,
	},
	{
		label: "Campanhas",
		icon: Megaphone,
		path: PagesEnum.CAMPAIGNS,
	},
	{
		label: "Banco de sangue",
		icon: Droplets,
		path: PagesEnum.BLOOD_BANK,
	},
	{
		label: "Doadores",
		icon: Users,
		path: PagesEnum.DONORS,
	},
	{
		label: "Métricas",
		icon: ChartSpline,
		path: PagesEnum.METRICS,
	},
	{
		label: "Ajuda",
		icon: CircleQuestionMark,
		path: PagesEnum.HELP,
	},
]
