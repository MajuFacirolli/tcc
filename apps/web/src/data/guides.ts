import { ChartSpline, Droplets, Megaphone, Users } from "lucide-react"

export const guides = [
	{
		icon: Droplets,
		title: "Gerenciar Estoque de Sangue",
		steps: [
			"Acesse Banco de Sangue pela barra lateral",
			"Visualize o status atual de cada tipo sanguíneo",
			"Clique no número de bolsas para editar inline",
			"Pressione Enter para confirmar a alteração",
			'Use "Criar Campanha" para mobilizar doadores de tipos críticos',
		],
	},
	{
		icon: Users,
		title: "Gerenciar Doadores",
		steps: [
			"Acesse Doadores pela barra lateral",
			"Use os filtros para segmentar por tipo sanguíneo, elegibilidade ou sexo",
			"Pesquise por nome ou email na barra de busca",
			"Visualize o badge de elegibilidade em cada linha",
			"Confira os dias restantes até a próxima elegibilidade",
		],
	},
	{
		icon: Megaphone,
		title: "Criar e Acompanhar Campanhas",
		steps: [
			'Acesse Campanhas e clique em "Nova Campanha"',
			"Selecione o tipo sanguíneo (visualize a contagem de elegíveis)",
			"Escreva a mensagem — use o preview do Email ao lado",
			"Revise o resumo e clique em Enviar Campanha",
			"Acompanhe as confirmações clicando na linha da campanha",
		],
	},
	{
		icon: ChartSpline,
		title: "Analisar Métricas",
		steps: [
			"Acesse Métricas pela barra lateral",
			"Selecione o período desejado (7, 30, 90 dias ou personalizado)",
			"Analise o gráfico de confirmações ao longo do tempo",
			"Compare taxas de conversão entre tipos sanguíneos",
			"Identifique as campanhas com melhor desempenho na tabela",
		],
	},
]
