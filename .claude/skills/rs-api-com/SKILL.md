---
name: rs-api-com
description: "Enforces Bun + ElysiaJS + Drizzle ORM best practices when building REST APIs, configuring database schemas, implementing authentication flows, creating metric endpoints, or setting up project tooling. Make sure to use this skill whenever writing API routes with Elysia, configuring Drizzle ORM schemas/migrations/seeds, implementing JWT or magic link auth, building dashboard metrics, or dockerizing PostgreSQL. Not for frontend, React, or non-Bun runtimes."
---

# API com Bun — Decision Tree Router

> Siga a árvore de decisão para chegar na skill certa. 34 skills organizadas em 6 domínios.

## Decision Tree

```
O que você está fazendo com Bun/Elysia?
│
├─ Setup / tooling?
│  ├─ Criando API Bun + Elysia → [bun-criando-api-com-bun-e-elysia.md](references/bun-criando-api-com-bun-e-elysia.md)
│  ├─ ESLint → [bun-configurando-es-lint-no-projeto.md](references/bun-configurando-es-lint-no-projeto.md)
│  ├─ Variáveis ambiente → [bun-variaveis-ambiente-no-bun.md](references/bun-variaveis-ambiente-no-bun.md)
│  ├─ PostgreSQL Docker → [bun-postgre-sql-no-docker-compose.md](references/bun-postgre-sql-no-docker-compose.md)
│  └─ Envio de email → [bun-envio-de-e-mail-com-nodemailer.md](references/bun-envio-de-e-mail-com-nodemailer.md)
│
├─ Drizzle ORM (schema/migrations/seed)?
│  ├─ Configurando Drizzle → [bun-configurando-drizzle-orm.md](references/bun-configurando-drizzle-orm.md)
│  ├─ Migrations → [bun-migrations-no-drizzle.md](references/bun-migrations-no-drizzle.md)
│  ├─ Relacionamentos → [bun-configurando-relacionamentos-no-drizzle.md](references/bun-configurando-relacionamentos-no-drizzle.md)
│  ├─ Schema produtos/pedidos → [bun-schema-de-produtos-e-pedidos.md](references/bun-schema-de-produtos-e-pedidos.md)
│  └─ Seed com Faker → [bun-seed-de-produtos-e-pedidos.md](references/bun-seed-de-produtos-e-pedidos.md)
│
├─ Autenticação?
│  ├─ JWT setup → [bun-setup-da-autenticacao-jwt.md](references/bun-setup-da-autenticacao-jwt.md)
│  ├─ Magic link → [bun-rota-autenticacao-pelo-link.md](references/bun-rota-autenticacao-pelo-link.md)
│  ├─ Logout → [bun-rota-logout-e-derivacao.md](references/bun-rota-logout-e-derivacao.md)
│  ├─ Perfil → [bun-rota-perfil-do-usuario-logado.md](references/bun-rota-perfil-do-usuario-logado.md)
│  └─ Validação owner → [bun-validando-restaurante-nas-rotas.md](references/bun-validando-restaurante-nas-rotas.md)
│
├─ Rotas / CRUD?
│  ├─ Rotas Elysia + Drizzle → [bun-rota-cadastro-de-restaurante.md](references/bun-rota-cadastro-de-restaurante.md)
│  ├─ Tipagem entrada → [bun-tipagem-na-entrada-de-dados.md](references/bun-tipagem-na-entrada-de-dados.md)
│  └─ Error handling → [bun-lidando-com-erros-no-elysia.md](references/bun-lidando-com-erros-no-elysia.md)
│
├─ Pedidos (order management)?
│  ├─ Listagem com paginação → [bun-rota-listagem-de-pedidos.md](references/bun-rota-listagem-de-pedidos.md)
│  ├─ Detalhes → [bun-rota-detalhes-do-pedido.md](references/bun-rota-detalhes-do-pedido.md)
│  ├─ Status transitions → [bun-rota-aprovar-pedido.md](references/bun-rota-aprovar-pedido.md)
│  └─ Ordenação → [bun-rota-ordenacao-dos-pedidos.md](references/bun-rota-ordenacao-dos-pedidos.md)
│
└─ Dashboard / métricas?
   ├─ Pedidos diários → [bun-rota-metrica-de-pedidos-diarios.md](references/bun-rota-metrica-de-pedidos-diarios.md)
   ├─ Pedidos mensais → [bun-rota-metrica-de-pedidos-mensais.md](references/bun-rota-metrica-de-pedidos-mensais.md)
   ├─ Receita mensal → [bun-rota-metrica-de-receita-mensal.md](references/bun-rota-metrica-de-receita-mensal.md)
   ├─ Produtos populares → [bun-rota-metrica-produtos-populares.md](references/bun-rota-metrica-produtos-populares.md)
   └─ Receita diária → [bun-rota-metrica-receita-diaria-no-periodo.md](references/bun-rota-metrica-receita-diaria-no-periodo.md)
```

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 3 (Implementação)** → Siga o ramo relevante por feature
