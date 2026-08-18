const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
	dateStyle: "full",
})

export const formatDate = (date: Date) => dateFormatter.format(date)

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
	dateStyle: "long",
	timeStyle: "short",
})

export const formatDateTime = (date: Date) => dateTimeFormatter.format(date)
