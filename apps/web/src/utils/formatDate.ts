const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
	dateStyle: "full",
})

export const formatDate = (date: Date) => dateFormatter.format(date)

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
	dateStyle: "long",
	timeStyle: "short",
})

export const formatDateTime = (date: Date) => dateTimeFormatter.format(date)

const shortDateFormatter = new Intl.DateTimeFormat("pt-BR", {
	dateStyle: "short",
})

export const formatShortDate = (date: Date) => shortDateFormatter.format(date)
