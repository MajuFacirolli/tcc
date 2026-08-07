export const faqs = [
	{
		question: "Como verifico se um doador está elegível para doação?",
		answer:
			"Na página Doadores, cada registro exibe um badge de elegibilidade. Um doador é considerado elegível quando passaram pelo menos 60 dias desde a última doação (90 dias para homens, conforme resolução RDC). O sistema calcula isso automaticamente com base na data da última doação cadastrada.",
	},
	{
		question: "Como criar uma campanha de mobilização?",
		answer:
			'Acesse a página Campanhas e clique em "Nova Campanha" no canto superior direito. O assistente de criação guia você em 3 etapas: (1) selecione o tipo sanguíneo alvo, (2) escreva a mensagem que será enviada aos doadores, e (3) revise e envie. Ao enviar, o sistema notifica automaticamente todos os doadores elegíveis do tipo selecionado.',
	},
	{
		question: "O que significam os status do estoque de sangue?",
		answer:
			"Cada tipo sanguíneo possui um limiar mínimo configurado. **Estável** (verde): bolsas acima de 150% do mínimo. **Atenção** (âmbar): bolsas entre 100% e 150% do mínimo. **Crítico** (vermelho): bolsas abaixo do limiar mínimo — ação imediata recomendada.",
	},
	{
		question: "Como editar a quantidade de bolsas no estoque?",
		answer:
			"Na página Banco de Sangue, clique diretamente no número de bolsas de qualquer tipo sanguíneo. O campo entrará em modo de edição inline — altere o valor e pressione Enter para confirmar, ou Esc para cancelar. A atualização é registrada imediatamente no banco de dados.",
	},
	{
		question: "Como acompanho as confirmações de intenção de doação?",
		answer:
			"Cada campanha enviada gera um link individual de confirmação para cada doador notificado. Os doadores confirmam pelo próprio celular. As confirmações aparecem em tempo real nos detalhes da campanha (clique em qualquer linha na tabela de campanhas para abrir o painel lateral com métricas completas).",
	},
	{
		question: "Como filtrar doadores por tipo sanguíneo ou elegibilidade?",
		answer:
			"Na página Doadores, utilize a barra de filtros acima da tabela. Você pode combinar filtros de tipo sanguíneo (seleção múltipla), status de elegibilidade e sexo. Os resultados atualizam instantaneamente. O campo de busca permite encontrar doadores por nome ou telefone.",
	},
	{
		question: "Como interpretar as métricas de conversão?",
		answer:
			"A taxa de conversão indica a proporção de doadores que confirmaram intenção de doação em relação ao total notificado. Por exemplo, 58% significa que 58 de cada 100 notificados confirmaram. Acesse a página Métricas para ver o histórico por período e comparativos entre tipos sanguíneos.",
	},
	{
		question: "Os dados exibidos são reais?",
		answer:
			"Não. Este é um sistema acadêmico com dados inteiramente simulados. Nenhuma informação reflete situações reais de doadores ou hemocentros. Os dados servem apenas para demonstração e testes da plataforma.",
	},
]
