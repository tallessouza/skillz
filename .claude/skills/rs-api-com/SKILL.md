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
│  ├─ Criando API Bun + Elysia → [bun-criando-api-com-bun-e-elysia.md](references/criando-api-com-bun-e-elysia.md)
│  ├─ ESLint → [bun-configurando-es-lint-no-projeto.md](references/configurando-es-lint-no-projeto.md)
│  ├─ Variáveis ambiente → [bun-variaveis-ambiente-no-bun.md](references/variaveis-ambiente-no-bun.md)
│  ├─ PostgreSQL Docker → [bun-postgre-sql-no-docker-compose.md](references/postgre-sql-no-docker-compose.md)
│  └─ Envio de email → [bun-envio-de-e-mail-com-nodemailer.md](references/envio-de-e-mail-com-nodemailer.md)
│
├─ Drizzle ORM (schema/migrations/seed)?
│  ├─ Configurando Drizzle → [bun-configurando-drizzle-orm.md](references/configurando-drizzle-orm.md)
│  ├─ Migrations → [bun-migrations-no-drizzle.md](references/migrations-no-drizzle.md)
│  ├─ Relacionamentos (relations API) → [bun-configurando-relacionamentos-no-drizzle.md](references/configurando-relacionamentos-no-drizzle.md)
│  ├─ Relacionamentos (FK/cascade) → [bun-relacionamentos-no-drizzle.md](references/relacionamentos-no-drizzle.md)
│  ├─ Schema produtos/pedidos → [bun-schema-de-produtos-e-pedidos.md](references/schema-de-produtos-e-pedidos.md)
│  ├─ Seed com Faker → [bun-seed-de-produtos-e-pedidos.md](references/seed-de-produtos-e-pedidos.md)
│  └─ Seed script Drizzle → [bun-criando-seed-com-drizzle.md](references/criando-seed-com-drizzle.md)
│
├─ Autenticação?
│  ├─ JWT setup → [bun-setup-da-autenticacao-jwt.md](references/setup-da-autenticacao-jwt.md)
│  ├─ Schema auth links → [bun-schema-de-links-de-autenticacao.md](references/schema-de-links-de-autenticacao.md)
│  ├─ Envio do magic link → [bun-rota-envio-do-link-de-autenticacao.md](references/rota-envio-do-link-de-autenticacao.md)
│  ├─ Magic link callback → [bun-rota-autenticacao-pelo-link.md](references/rota-autenticacao-pelo-link.md)
│  ├─ Logout → [bun-rota-logout-e-derivacao.md](references/rota-logout-e-derivacao.md)
│  ├─ Perfil → [bun-rota-perfil-do-usuario-logado.md](references/rota-perfil-do-usuario-logado.md)
│  └─ Validação owner → [bun-validando-restaurante-nas-rotas.md](references/validando-restaurante-nas-rotas.md)
│
├─ Rotas / CRUD?
│  ├─ Rotas Elysia + Drizzle → [bun-rota-cadastro-de-restaurante.md](references/rota-cadastro-de-restaurante.md)
│  ├─ Recurso gerenciado (ownership) → [bun-rota-restaurante-gerenciado.md](references/rota-restaurante-gerenciado.md)
│  ├─ Tipagem entrada → [bun-tipagem-na-entrada-de-dados.md](references/tipagem-na-entrada-de-dados.md)
│  └─ Error handling → [bun-lidando-com-erros-no-elysia.md](references/lidando-com-erros-no-elysia.md)
│
├─ Pedidos (order management)?
│  ├─ Listagem com paginação → [bun-rota-listagem-de-pedidos.md](references/rota-listagem-de-pedidos.md)
│  ├─ Detalhes → [bun-rota-detalhes-do-pedido.md](references/rota-detalhes-do-pedido.md)
│  ├─ Status transitions → [bun-rota-aprovar-pedido.md](references/rota-aprovar-pedido.md)
│  ├─ Ações no pedido (cancel/deliver/dispatch) → [bun-rotas-acoes-no-pedido.md](references/rotas-acoes-no-pedido.md)
│  └─ Ordenação → [bun-rota-ordenacao-dos-pedidos.md](references/rota-ordenacao-dos-pedidos.md)
│
└─ Dashboard / métricas?
   ├─ Pedidos diários → [bun-rota-metrica-de-pedidos-diarios.md](references/rota-metrica-de-pedidos-diarios.md)
   ├─ Pedidos mensais → [bun-rota-metrica-de-pedidos-mensais.md](references/rota-metrica-de-pedidos-mensais.md)
   ├─ Receita mensal → [bun-rota-metrica-de-receita-mensal.md](references/rota-metrica-de-receita-mensal.md)
   ├─ Pedidos cancelados → [bun-rota-metrica-de-pedidos-cancelados.md](references/rota-metrica-de-pedidos-cancelados.md)
   ├─ Produtos populares → [bun-rota-metrica-produtos-populares.md](references/rota-metrica-produtos-populares.md)
   └─ Receita diária → [bun-rota-metrica-receita-diaria-no-periodo.md](references/rota-metrica-receita-diaria-no-periodo.md)
```

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 3 (Implementação)** → Siga o ramo relevante por feature

## Cross-References — Decision Coverage

Quando este router nao cobre uma decisao, delegue para:

| Decisao | Delegue para | Motivo |
|---------|-------------|--------|
| D3_DEPLOY (Docker/CI) | [rs-devops](../rs-devops/SKILL.md) | Docker, CI/CD, deploy |
| D3_TESTING (Jest/Playwright) | [rs-testes-e](../rs-testes-e/SKILL.md) | Testes |
| DX_SECURITY (XSS/CSRF) | [rs-seguranca-para](../rs-seguranca-para/SKILL.md) | Seguranca web |
| DX_QUALITY (clean code) | [rs-clean-code](../rs-clean-code/SKILL.md) | Premissa de escrita |
