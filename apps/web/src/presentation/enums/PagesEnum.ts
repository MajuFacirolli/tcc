export const PagesEnum = {
	HOME: "/",
	CAMPAIGNS: "/campanhas",
	NEW_CAMPAIGN: "/campanhas/nova",
	BLOOD_BANK: "/banco-de-sangue",
	DONORS: "/doadores",
	METRICS: "/metricas",
	HELP: "/ajuda",
	LOGIN: "/login",
} as const

export type PagesEnum = (typeof PagesEnum)[keyof typeof PagesEnum]
