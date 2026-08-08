export const PagesEnum = {
	HOME: "/",
	CAMPAIGNS: "/campanhas",
	BLOOD_BANK: "/estoque",
	DONORS: "/doadores",
	METRICS: "/metricas",
	HELP: "/ajuda",
	LOGIN: "/login",
} as const

export type PagesEnum = (typeof PagesEnum)[keyof typeof PagesEnum]
