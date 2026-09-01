# TCC

## Setup

```bash
pnpm install

cd apps/api
docker compose up -d          # postgres + redis
cp .env.example .env          # preencha JWT_SECRET (32+ chars), SEED_ADMIN_PASSWORD e SMTP_*
pnpm db:setup                 # aplica as migrations e popula o banco
```

`pnpm db:setup` é idempotente e pode ser rodado quantas vezes precisar:

- `db:migrate` cria o schema;
- `db:seed` cria/atualiza o usuário admin (a partir de `SEED_ADMIN_NAME`,
  `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD`), preenche a tabela `blood_bank` com uma
  linha por tipo sanguíneo e insere 1000 doadores de demonstração. O estoque já
  existente nunca é sobrescrito, e os doadores têm ids derivados do índice +
  `on conflict do nothing`, então reexecutar nunca duplica nem mexe em quem foi
  cadastrado depois.

Depois disso, `pnpm dev` na raiz sobe api + web.

### Doadores de demonstração

Os 1000 doadores existem para que a listagem, os filtros e o fluxo de campanhas tenham
dados num banco novo. Mil linhas são muitas para escrever à mão, então
`seedDonors.ts` as gera a partir de listas de nomes. Três detalhes importam:

- **Os e-mails são inentregáveis de propósito.** Criar uma campanha enfileira um e-mail
  real para cada doador apto do tipo sanguíneo escolhido, então todo endereço semeado
  fica sob `example.com` — domínio reservado pela RFC 2606 justamente para nunca chegar
  a uma pessoa. Se você trocar esses endereços por endereços reais, criar uma campanha
  passa a enviar e-mail de verdade para eles.
- **Gerado não quer dizer aleatório.** O sorteio usa um PRNG com semente fixa
  (`RANDOM_SEED`), então a mesma semente produz sempre os mesmos mil doadores —
  `Math.random` daria um banco diferente a cada execução. Trocar a semente reembaralha
  todo mundo.
- **A última doação é um deslocamento, não uma data fixa**, resolvido no momento do
  seed. Assim a divisão entre aptos e em intervalo nasce equilibrada em qualquer data:
  hoje dá ~600 aptos e ~400 em intervalo, com ~13% que nunca doaram.

A distribuição de tipos sanguíneos aproxima a brasileira (O+ e A+ com ~35% cada, AB-
com ~0,3%), e os oito primeiros doadores são fixados exatamente nos limites da regra —
59/60/61 dias para homens, 89/90/91 para mulheres, mais um de cada sexo que nunca doou —
para que os casos de fronteira estejam sempre no banco em vez de dependerem do sorteio.

Cada fixture declara um deslocamento em relação ao limite **do próprio sexo**
(`offsetFromThreshold`), nunca uma contagem de dias literal. Isso torna impossível
descrever um homem pelo intervalo feminino, ou o contrário — um doador cujos dados
pertenceriam a uma regra que não se aplica a ele.

Se você rodou uma versão anterior do seed, os doadores antigos continuam lá (o
`on conflict do nothing` não os atualiza). Para regerar só o que o seed criou:

```sql
delete from donors where id like '019318a0-0000-7000-8000-%';
```

## UI de filas (`/dashboard`)

O Bull Board tem credencial própria, separada do login do painel: os payloads dos jobs
carregam nome e e-mail de doadores, e a UI permite reprocessar e remover jobs — então
adicionar um usuário admin não deve, de tabela, conceder acesso operacional a esses dados.

Preencha `DASHBOARD_USER` e `DASHBOARD_PASSWORD` (12+ chars) para habilitar. **Sem as
duas variáveis a rota não é montada** — um deploy que esqueça o segredo não expõe nada,
em vez de expor sem autenticação.
