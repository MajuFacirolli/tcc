# TCC - HemoConnect

DESENVOLVIMENTO E AVALIAÇÃO TÉCNICA DE UM SISTEMA DE APOIO À MOBILIZAÇÃO ESTRATÉGICA DE DOADORES DE SANGUE
.

A manutenção de estoques adequados de sangue constitui um desafio para os hemocentros, especialmente em situações de baixa disponibilidade de determinados tipos sanguíneos, nas quais o direcionamento das campanhas de mobilização torna-se relevante. Nesse contexto, este trabalho apresenta o desenvolvimento e a avaliação técnica de um sistema web de apoio à mobilização estratégica de doadores de sangue, integrando princípios de segmentação, comunicação persuasiva e engajamento digital. A solução permite gerenciar estoques, verificar a elegibilidade de doadores, segmentar campanhas por tipo sanguíneo e registrar intenções de doação. A avaliação foi realizada por meio de testes automatizados unitários, de integração e End-to-End. Foram executados 101 testes, todos aprovados. Os resultados evidenciaram o funcionamento das principais regras de negócio e a aplicação dos princípios teóricos em funcionalidades do sistema. Conclui-se que a solução apresenta viabilidade técnica para apoiar o direcionamento de campanhas de mobilização, embora sua eficácia sobre o comportamento de doadores não tenha sido avaliada em contexto real.

---

## 🧭 Índice

- 🧱 [Arquitetura](#-arquitetura)
- 📦 [Stack](#-stack)
- 📁 [Estrutura do repositório](#-estrutura-do-repositório)
- 🚀 [Setup](#-setup)
- 🔑 [Variáveis de ambiente](#-variáveis-de-ambiente)
- 🏃 [Rodando o projeto](#-rodando-o-projeto)
- 🧬 [Modelo de dados](#-modelo-de-dados)
- 🩸 [Regras de domínio](#-regras-de-domínio)
- 📨 [Fluxo de uma campanha](#-fluxo-de-uma-campanha)
- 📊 [Métricas](#-métricas)
- 🔌 [API](#-api)
- 🎨 [Front-end](#-front-end)
- 🔁 [Filas e workers](#-filas-e-workers)
- 🧰 [UI de filas (`/dashboard`)](#-ui-de-filas-dashboard)
- 🌱 [Doadores de demonstração](#-doadores-de-demonstração)
- 🧪 [Testes](#-testes)
- 🐘 [Migrations](#-migrations)
- 🧹 [Lint e formatação](#-lint-e-formatação)
- 🔒 [Segurança](#-segurança)
- 🐛 [Solução de problemas](#-solução-de-problemas)
- 🎓 [Artefatos acadêmicos](#-artefatos-acadêmicos)

---

## 🧱 Arquitetura

Monorepo pnpm + Turborepo com três aplicações:

```
navegador ──HTTP+cookie──> apps/web (React SPA, Vite)
                               │
                               ▼  fetch (credentials: include)
                           apps/api (Fastify)
                          ┌────┴─────────────────┐
                          │                      │
                     PostgreSQL              Redis / BullMQ
                     (Drizzle ORM)                │
                                                  ▼
                                        worker de disparo
                                       (envia e-mail, fecha campanha)
```

A API segue uma separação em quatro camadas, com dependências apontando sempre para
dentro:

| Camada | Onde | O que contém |
| --- | --- | --- |
| `domain` | `src/domain` | Entidades, value objects e **regras puras** (elegibilidade, audiência, janela de métricas). Sem I/O, sem framework. |
| `application` | `src/application` | Casos de uso, DTOs e as **interfaces** (`IDonorsRepository`, `IEmailService`, `IJobQueue`…) que a infraestrutura implementa. |
| `infrastructure` | `src/infrastructure` | Drizzle/Postgres, BullMQ/Redis, Nodemailer, Argon2, templates React Email. |
| `presentation` | `src/presentation` | Rotas Fastify, controllers, schemas Zod, middlewares. |

A ligação entre interface e implementação está em `src/container/Ioc.config.ts`
(Inversify). Um caso de uso nunca importa Drizzle nem BullMQ — recebe a interface pelo
construtor. É isso que permite os testes unitários rodarem sem banco e o e-mail ser
trocado por um transporte que não entrega nada.

O front-end espelha a mesma ideia em CQRS leve: `domain/queries` e `domain/commands`
declaram interfaces, `data/queries` e `data/commands` as implementam sobre o cliente
HTTP, `factories/` monta cada uma, e os hooks de `presentation/hooks` as consomem via
TanStack Query.

## 📦 Stack

**API** — Node.js + TypeScript, [Fastify 5](https://fastify.dev),
[Drizzle ORM](https://orm.drizzle.team) sobre PostgreSQL 17,
[BullMQ](https://docs.bullmq.io) sobre Redis 7, [Zod 4](https://zod.dev) (validação e
geração do OpenAPI via `fastify-type-provider-zod`), [Inversify](https://inversify.io),
[Argon2](https://github.com/napi-rs/node-rs) para senhas, Nodemailer +
[React Email](https://react.email), Scalar para a referência da API.

**Web** — React 19, [Vite](https://vite.dev),
[TanStack Router](https://tanstack.com/router) (file-based, code splitting automático) +
[TanStack Query](https://tanstack.com/query), Tailwind CSS 4, Radix UI + shadcn,
React Hook Form + Zod, [nuqs](https://nuqs.dev) (filtros na URL),
[Recharts](https://recharts.org), AutoMapper (response → view model).

**E2E** — [Playwright](https://playwright.dev).

**Tooling** — pnpm 10 (workspaces), Turborepo, [Biome](https://biomejs.dev),
Vitest 4.

## 📁 Estrutura do repositório

```
apps/
  api/                      Fastify + Drizzle + BullMQ
    src/
      domain/               entidades, value objects, regras puras
      application/          casos de uso, DTOs, interfaces
      infrastructure/       Drizzle, filas, e-mail, hashing
      presentation/         rotas, controllers, schemas, middlewares
      container/            configuração do Inversify
      core/                 erros HTTP, PagedList, status codes
      _tests/               unit, routes, integration, apoio ao e2e
      app.ts                monta a instância Fastify
      server.ts             sobe o HTTP
      worker.ts             sobe os workers BullMQ
    docker-compose.yml      postgres + redis
  web/                      SPA React
    src/
      domain/               interfaces de queries/commands, view models, enums
      data/                 implementações, cliente HTTP, mappers
      factories/            monta cada query/command
      presentation/         rotas, componentes, hooks, estilos
  e2e/                      Playwright (sobe api + web + worker próprios)
artefatos/                  diagramas e documento de requisitos (fora do git)
```

## 🚀 Setup

Pré-requisitos: **Node.js 22+**, **pnpm 10** e **Docker**.

```bash
pnpm install

cd apps/api
docker compose up -d          # postgres + redis
cp .env.example .env          # preencha JWT_SECRET (32+ chars), SEED_ADMIN_PASSWORD e SMTP_*
pnpm db:setup                 # aplica as migrations e popula o banco

cd ../web
cp .env.example .env          # VITE_API_URL
```

`pnpm db:setup` é idempotente e pode ser rodado quantas vezes precisar:

- `db:migrate` cria o schema;
- `db:seed` cria/atualiza o usuário admin (a partir de `SEED_ADMIN_NAME`,
  `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD`), preenche a tabela `blood_bank` com uma
  linha por tipo sanguíneo e insere 1000 doadores de demonstração. O estoque já
  existente nunca é sobrescrito, e os doadores têm ids derivados do índice +
  `on conflict do nothing`, então reexecutar nunca duplica nem mexe em quem foi
  cadastrado depois.

Para o e2e, instale também o navegador uma vez:

```bash
pnpm --filter e2e install-browsers
```

## 🔑 Variáveis de ambiente

### `apps/api/.env`

| Variável | Obrigatória | Padrão | Observação |
| --- | --- | --- | --- |
| `PORT` | não | `3333` | |
| `NODE_ENV` | não | `development` | `development` \| `production` \| `test` |
| `DATABASE_URL` | **sim** | — | URL do PostgreSQL |
| `JWT_SECRET` | **sim** | — | mínimo 32 caracteres |
| `SESSION_DURATION` | não | `7d` | aceita `7d`, `12h`, `30m` ou segundos puros |
| `WEB_ORIGIN` | não | `http://localhost:5173` | origem do CORS **e** base do link de confirmação |
| `REDIS_URL` | **sim** | — | URL do Redis |
| `SEED_ADMIN_NAME` / `_EMAIL` / `_PASSWORD` | só para o seed | — | senha com 8+ caracteres |
| `DASHBOARD_USER` / `DASHBOARD_PASSWORD` | não | — | **sem as duas, `/dashboard` não é montado** |
| `EMAIL_TRANSPORT` | não | `smtp` | `noop` descarta as mensagens |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | **sim** | — | validadas mesmo com `EMAIL_TRANSPORT=noop` |

O schema está em `apps/api/src/env.ts` e é validado com Zod na inicialização: uma
variável faltando derruba o processo no boot, não no meio de um request.

### `apps/web/.env`

| Variável | Observação |
| --- | --- |
| `VITE_API_URL` | base da API, ex. `http://localhost:3333` |
| `VITE_SCHEDULE_URL` | link externo de agendamento exibido ao doador na confirmação |

## 🏃 Rodando o projeto

Na raiz:

```bash
pnpm dev          # api (3333) + web (5173), via turbo
pnpm build        # build de todos os apps
pnpm lint         # biome check
pnpm format       # biome format --write
```

**O worker não sobe com `pnpm dev`.** Ele é um processo separado, e sem ele as campanhas
são criadas mas nenhum e-mail sai da fila:

```bash
pnpm --filter api dev:worker
```

Em produção: `pnpm --filter api start` e `pnpm --filter api start:worker`.

Endereços em desenvolvimento:

| | | URL |
| --- | --- | --- |
| 🎨 | Web | http://localhost:5173 |
| 🔌 | API | http://localhost:3333 |
| 📚 | Docs (Scalar/OpenAPI) | http://localhost:3333/docs |
| 🧰 | Bull Board | http://localhost:3333/dashboard |

## 🧬 Modelo de dados

```
users            id, name, email (unique), passwordHash, createdAt, updatedAt

donors           id, name, sex (male|female), bloodType, lastDonationDate?, email

blood_bank       id (= tipo sanguíneo, PK), bagsCount, minThreshold, updatedAt

campaigns        id, title, message, bloodType?, kind (generic|segmented),
                 status (active|closed), totalEligibleDonors, notifiedCount,
                 intentionConfirmationsCount, averageResponseTime, createdAt

confirmations    id, token (unique), campaignId → campaigns, donorId → donors,
                 confirmedAt?, createdAt
                 unique(campaignId, donorId)
```

Notas que valem mais que o diagrama:

- `campaigns.bloodType` é `null` numa campanha genérica — ela não pede tipo nenhum.
- `confirmations` tem índice único por `(campaignId, donorId)`: um doador recebe no
  máximo um token por campanha, e reenviar o e-mail reaproveita o token em vez de criar
  outro.
- `confirmedAt` nulo significa "notificado e ainda não respondeu". A diferença entre
  `createdAt` e `confirmedAt` é o tempo de resposta que alimenta as métricas.
- Ids são UUIDv7 — ordenáveis por tempo, o que dá paginação estável por id.

## 🩸 Regras de domínio

**Elegibilidade** (`domain/rules/donorEligibility.ts`) — intervalo mínimo entre doações:
**60 dias para homens, 90 para mulheres**. Quem nunca doou é elegível.

A regra é escrita duas vezes de propósito: em TypeScript, para entidades já em memória,
e em SQL (`infrastructure/database/drizzle/donorEligibility.ts`) para poder ser filtrada
e contada no banco. As duas leem as mesmas constantes, então mudar um número muda todos
os chamadores.

**Audiência de campanha** (`domain/rules/campaignAudience.ts`) — define quem uma campanha
notifica, por kind:

| Kind | Audiência | Consequência |
| --- | --- | --- |
| `generic` | toda a base de doadores | inclui quem tem o tipo errado e quem está no intervalo |
| `segmented` | mesmo tipo sanguíneo **e** elegível | só quem pode efetivamente atender |

`countEligibleInAudience` mede quantos dos notificados podiam de fato doar. A diferença
entre isso e o tamanho da audiência é o desperdício que uma campanha genérica incorre
por construção — é exatamente o número que o trabalho quer comparar.

**Status do estoque** (`domain/entities/BloodBank.ts`) — derivado, nunca armazenado:

| Status | Condição |
| --- | --- |
| 🔴 `critical` | `bagsCount < minThreshold` |
| 🟡 `warning` | `bagsCount < minThreshold * 1.5` |
| 🟢 `stable` | acima disso |

## 📨 Fluxo de uma campanha

1. **Criação** (`POST /api/campaigns`). `CreateCampaignUseCase` carrega os candidatos
   (todos, ou os do tipo pedido), aplica `selectCampaignAudience`, grava a campanha com
   `totalEligibleDonors` já calculado e enfileira um job por doador da audiência.
   Audiência vazia → a campanha nasce `closed` e nada é enfileirado.
2. **Disparo** (fila `campaign-email`, concorrência 5). Para cada job,
   `SendCampaignEmailUseCase` substitui `[Nome]` na mensagem, gera um token de
   confirmação (32 bytes aleatórios, base64url), renderiza o template React Email, envia
   e incrementa `notifiedCount`.
3. **Encerramento** (fila `campaign-lifecycle`). Um job encadeado ao fim do lote marca a
   campanha como `closed`.
4. **Confirmação** (`POST /api/confirmations/:token`, sem autenticação). O doador abre
   `/{WEB_ORIGIN}/confirmacoes/{token}`, a página confirma, e a mesma transação grava
   `confirmedAt` e atualiza `intentionConfirmationsCount` e a média incremental de
   `averageResponseTime` na campanha. Abrir o link de novo devolve
   `alreadyConfirmed: true` sem contar duas vezes.

Jobs têm 3 tentativas com backoff exponencial (5 s), 1000 concluídos e 5000 falhos
retidos para inspeção no Bull Board.

## 📊 Métricas

Duas leituras, com janelas diferentes:

`GET /api/metrics/daily` — cartões do painel para **hoje** (`[meia-noite, próxima
meia-noite)`): doadores cadastrados, doadores elegíveis, campanhas ativas, confirmações
e notificações do dia.

`GET /api/metrics` — a análise, sobre uma janela **fixa de 30 dias**. Não há filtro de
período: a página inteira compartilha um intervalo por construção, e nenhum painel pode
acabar mostrando um recorte diferente do vizinho.

| Bloco | Conteúdo |
| --- | --- |
| `headline` | taxa de resposta, tempo médio de resposta, intenções, retenção |
| `reach` | notificações, doadores alcançados, respondentes, respondentes recorrentes, pool elegível |
| `retention` | taxa de retenção (respondeu → respondeu de novo) e de reativação (ignorou → respondeu) |
| `responseSpeed` | curva cumulativa em 2 h, 6 h, 12 h, 24 h e 48 h |
| `byBloodType` | notificações, intenções, taxa e saldo de estoque por tipo — **ordenado pelo estoque mais curto primeiro**, para que o tipo que precisa de campanha seja o primeiro a ser lido |
| `series` | um bucket por dia da janela |
| `campaigns` | desempenho campanha a campanha |

## 🔌 API

Todas as respostas seguem o envelope `{ data, status, message }`. A autenticação é por
**cookie HttpOnly** com JWT (`onlyCookie: true` — o token não é aceito por header).

| Método | Rota | Auth | Descrição |
| --- | --- | --- | --- |
| `GET` | `/api/health` | — | readiness probe |
| `POST` | `/api/auth/sign-in` | — | login (rate limit 10/min) |
| `POST` | `/api/auth/sign-out` | — | limpa o cookie |
| `GET` | `/api/auth/profile` | cookie | usuário da sessão |
| `GET` | `/api/campaigns` | cookie | lista paginada; filtros `status`, `bloodType`, `kind` |
| `GET` | `/api/campaigns/summary` | cookie | campanhas recentes |
| `POST` | `/api/campaigns` | cookie | cria e dispara |
| `GET` | `/api/donors` | cookie | lista paginada; filtros `bloodType`, `isEligible` |
| `GET` | `/api/donors/eligible-count` | cookie | quantos elegíveis de um tipo |
| `GET` | `/api/bloodBank/summary` | cookie | estoque + status por tipo |
| `GET` | `/api/metrics` | cookie | análise de 30 dias |
| `GET` | `/api/metrics/daily` | cookie | cartões do dia |
| `POST` | `/api/confirmations/:token` | — | registra intenção (rate limit 20/min) |

A especificação OpenAPI é gerada dos próprios schemas Zod das rotas — não há um
documento paralelo para sair de sincronia. Referência navegável em `/docs`.

## 🎨 Front-end

Roteamento file-based com TanStack Router, em `src/presentation/routes`:

| Rota | Página |
| --- | --- |
| `/login` | autenticação |
| `/` | painel (métricas do dia, estoque, campanhas recentes) |
| `/campanhas` | lista com filtros na URL |
| `/campanhas/nova` | formulário com preview do e-mail e contagem de elegíveis ao vivo |
| `/doadores` | tabela com filtros de tipo e elegibilidade |
| `/banco-de-sangue` | estoque por tipo |
| `/metricas` | a análise de 30 dias |
| `/ajuda` | FAQ e guias |
| `/confirmacoes/$token` | página pública que o doador abre pelo e-mail |

O layout `_dashboard` resolve o perfil em `beforeLoad` e redireciona para `/login` se
não houver sessão — a proteção fica na rota, não espalhada pelos componentes. Filtros e
paginação vivem na query string (nuqs), então qualquer estado de lista é linkável e
sobrevive ao refresh.

## 🔁 Filas e workers

| Fila | Job | Concorrência | Papel |
| --- | --- | --- | --- |
| `campaign-email` | `send-campaign-email` | 5 | um job por doador notificado |
| `campaign-lifecycle` | `close-campaign` | 5 | encerra a campanha após o lote |

`src/worker.ts` instancia um `Worker` por definição em
`infrastructure/queue/jobDefinitions.ts` e desliga em `SIGTERM`/`SIGINT`. Para adicionar
uma fila, basta criar a definição e registrá-la nessa lista — o worker, as `queues` e o
Bull Board se atualizam sozinhos.

## 🧰 UI de filas (`/dashboard`)

O Bull Board tem credencial própria, separada do login do painel: os payloads dos jobs
carregam nome e e-mail de doadores, e a UI permite reprocessar e remover jobs — então
adicionar um usuário admin não deve, de tabela, conceder acesso operacional a esses dados.

Preencha `DASHBOARD_USER` e `DASHBOARD_PASSWORD` (12+ chars) para habilitar. **Sem as
duas variáveis a rota não é montada** — um deploy que esqueça o segredo não expõe nada,
em vez de expor sem autenticação.

## 🌱 Doadores de demonstração

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

## 🧪 Testes

Três camadas, três infraestruturas isoladas — nenhuma toca o banco de desenvolvimento.

```bash
pnpm test               # unitários + rotas (sem banco)
pnpm test:integration   # exige postgres e redis de pé
pnpm test:e2e           # Playwright: sobe api + web + worker próprios
```

| Camada | Onde | Banco | Redis |
| --- | --- | --- | --- |
| unitários / rotas | `apps/api/src/_tests/{domain,application,routes,infrastructure}` | nenhum (a URL aponta para um host inexistente, de propósito) | — |
| integração | `apps/api/src/_tests/integration` | `hemoconnect_test` | db 15 |
| e2e | `apps/e2e/tests` | `hemoconnect_e2e` | db 14 |
| desenvolvimento | — | `hemoconnect` | db 0 |

Decisões que valem saber antes de mexer:

- Os dois *projects* do Vitest têm `setupFiles` próprios. O setup unitário aponta
  `DATABASE_URL` para um host que não existe — vazar isso para a integração quebraria a
  suíte de um jeito confuso.
- A integração roda um arquivo por vez (`fileParallelism: false`, `pool: "forks"`):
  compartilha um banco e um índice do Redis, e o pool de forks permite reapear um
  processo com handle aberto em vez de travar a run.
- O `isolate` padrão do Vitest é o que dá a cada arquivo um grafo de módulos novo — é
  assim que os singletons `db`, `redisConnection`, `queues` e `container` são
  reconstruídos por arquivo, e rebinds do container não vazam entre arquivos.
- O e2e usa portas próprias (API 3401, web 5273) para não atrapalhar um `pnpm dev`
  rodando, e `EMAIL_TRANSPORT=noop`: **nenhuma mensagem sai da máquina durante a suíte**.
- `retries: 0` — um teste que só passa na segunda tentativa não é um resultado que se
  cite num trabalho.
- O worker de disparo é iniciado pelo `globalSetup` do Playwright, e não pelo
  `webServer`, porque não serve HTTP e portanto não tem URL para o Playwright sondar.

Cobertura do e2e: login, criação de campanha e disparo ponta a ponta; confirmação pelo
link, clique repetido no mesmo link (não conta duas vezes) e link inválido.

## 🐘 Migrations

```bash
cd apps/api
pnpm db:generate   # gera SQL a partir das mudanças no schema Drizzle
pnpm db:migrate    # aplica
pnpm db:studio     # inspeção visual
```

O schema fonte é `src/infrastructure/database/drizzle/schema/index.ts`; os arquivos
gerados ficam em `src/infrastructure/database/drizzle/migrations`. Nomenclatura em
`snake_case` é aplicada pelo `casing` do drizzle-kit — os campos são declarados em
camelCase no TypeScript e nascem em snake_case no banco.

## 🧹 Lint e formatação

Biome, configurado na raiz (`biome.json`): tabs, largura 80, aspas duplas, ponto e
vírgula só quando necessário. Artefatos gerados (`dist`, `routeTree.gen.ts`,
`playwright-report`, `test-results`, `.auth`) ficam de fora.

```bash
pnpm lint      # verifica
pnpm format    # corrige
```

## 🔒 Segurança

- Senhas com **Argon2** (`@node-rs/argon2`).
- Sessão em **cookie HttpOnly**, JWT verificado apenas via cookie — não há caminho por
  header, o que fecha a superfície de XSS-lê-o-token.
- **CORS** restrito a `WEB_ORIGIN`, com `credentials: true`.
- **Rate limit** nas duas rotas públicas: login (10/min) e confirmação (20/min).
- Tokens de confirmação são 32 bytes de `crypto.randomBytes` em base64url — não
  deriváveis a partir do id do doador ou da campanha.
- O Bull Board tem autenticação própria e não é montado sem segredo (ver acima).
- Todo o env é validado no boot; um segredo curto demais impede o processo de subir.

## 🐛 Solução de problemas

❌ **A campanha foi criada mas nenhum e-mail saiu.** O worker não sobe junto com
`pnpm dev`. Rode `pnpm --filter api dev:worker` e confira a fila em `/dashboard`.

❌ **O login funciona no Insomnia mas não no navegador.** O cookie é descartado quando
`WEB_ORIGIN` na API não bate exatamente com a origem que o navegador visita — porta
inclusive. As três pontas (CORS, origem do browser, `VITE_API_URL`) precisam concordar.

❌ **A API não sobe e reclama de env.** O Zod valida tudo no boot. `JWT_SECRET` precisa de
32+ caracteres e as cinco variáveis `SMTP_*` são obrigatórias mesmo com
`EMAIL_TRANSPORT=noop`.

❌ **O e2e trava no login.** O `globalSetup` apaga `.auth/` justamente por isso: um JWT
antigo ainda verifica depois de um re-seed, mas nomeia um usuário que não existe mais e
todo teste volta silenciosamente para a tela de login.

❌ **`/dashboard` dá 404.** Faltam `DASHBOARD_USER` ou `DASHBOARD_PASSWORD` — sem as duas a
rota não é registrada.

❌ **A suíte de integração falha ao conectar.** Ela precisa de Postgres e Redis de pé
(`docker compose up -d` em `apps/api`); ela cria o próprio banco, mas não o servidor.

## 🎓 Artefatos acadêmicos

`artefatos/` reúne o material do trabalho — diagramas de casos de uso, de classes e de
implantação, e o documento de requisitos.
