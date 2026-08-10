const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
	dateStyle: "full",
})

export const formatDate = (date: Date) => dateFormatter.format(date)
