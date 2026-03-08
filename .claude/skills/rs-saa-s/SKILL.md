---
name: rs-saa-s
description: "Enforces SaaS multi-tenant best practices when building RBAC systems, implementing organization management, creating invitation flows, setting up monorepo architecture, deploying full-stack apps, or configuring CASL permissions. Make sure to use this skill whenever implementing multi-tenant SaaS with Next.js, Fastify API routes with Prisma, role-based access control, organization switchers, member management, or OAuth authentication flows. Not for simple CRUD apps without multi-tenancy, standalone React SPAs, or non-SaaS architectures."
---

# SaaS Multi-Tenant — Fluxo de Decisões

> Toda decisão SaaS segue: multi-tenancy é o constraint #1 — cada feature deve respeitar o escopo da organização.

> **Caminho rápido para SaaS multi-tenant completo:**
> TurboRepo monorepo → Fastify API + Prisma → CASL permissions → Next.js App Router → Deploy Render + Vercel
> Skills: criando-monorepo-com-turbo-repo → setup-do-app-com-fastify → setup-do-banco-de-dados → introducao-ao-casl → setup-do-projeto-next-js → deploy-do-back-end

---

## Estou começando o projeto do zero?

### Sim — preciso do setup inicial

#### Como estruturar o projeto?
Monorepo com TurboRepo + PNPM — múltiplos packages (API, web, config, auth), shared code entre apps
- [criando-monorepo-com-turbo-repo](references/criando-monorepo-com-turbo-repo.md) — Setup TurboRepo + PNPM workspaces
- [es-lint-and-type-script-no-monorepo](references/es-lint-and-type-script-no-monorepo.md) — ESLint + TypeScript + Prettier compartilhados
- [estrutura-dos-projetos](references/estrutura-dos-projetos.md) — Route groups e organização Next.js

#### Como configurar o backend?
- [setup-do-app-com-fastify](references/setup-do-app-com-fastify.md) — Fastify + Zod validation + plugins
- [setup-do-swagger](references/setup-do-swagger.md) — Swagger/OpenAPI docs automáticas
- [error-handling-no-fastify](references/error-handling-no-fastify.md) — Error handler global padronizado
- [variaveis-ambiente-8](references/variaveis-ambiente-8.md) — Env vars no backend

#### Como configurar o banco de dados?
- [setup-do-banco-de-dados](references/setup-do-banco-de-dados.md) — Schema Prisma multi-tenant (org scoped)
- [criando-seed-do-banco-de-dados](references/criando-seed-do-banco-de-dados.md) — Seeds com Faker
- [ajustes-nos-cascades-do-banco-de-dados](references/ajustes-nos-cascades-do-banco-de-dados.md) — Cascade delete/set-null strategies

#### Como configurar o frontend?
- [setup-do-projeto-next-js](references/setup-do-projeto-next-js.md) — Next.js dentro do monorepo PNPM
- [setup-do-shadcn-ui](references/setup-do-shadcn-ui.md) — shadcn/ui components
- [setup-do-cliente-http-ky](references/setup-do-cliente-http-ky.md) — HTTP client com Ky
- [utilizando-variaveis-ambiente](references/utilizando-variaveis-ambiente.md) — Env vars no frontend

### Não — quero adicionar uma feature específica
→ Siga para a decisão relevante abaixo.

---

## Como os usuários se autenticam?

### Via senha (email + password)
Quando escolher: fluxo tradicional, não depende de provider externo
- [rota-cadastro-de-usuario](references/rota-cadastro-de-usuario.md) — Registro com bcrypt + Prisma
- [rota-autenticacao-via-senha](references/rota-autenticacao-via-senha.md) — Login via senha + JWT
- [criando-middleware-de-autenticacao](references/criando-middleware-de-autenticacao.md) — Middleware JWT no Fastify
- [rota-troca-de-senha](references/rota-troca-de-senha.md) — Password recovery/reset

#### Preciso das páginas de auth no frontend?
- [pagina-de-autenticacao](references/pagina-de-autenticacao.md) — Página de login com shadcn/ui
- [pagina-de-cadastro-1](references/pagina-de-cadastro-1.md) — Signup + forgot password pages
- [realizando-login-do-usuario](references/realizando-login-do-usuario.md) — Login com cookies + redirect
- [criando-novos-usuarios](references/criando-novos-usuarios.md) — Form de signup com Zod + Server Actions

### Via OAuth (GitHub)
Quando escolher: login social, reduzir fricção, enterprise SSO
- [dominio-e-app-github](references/dominio-e-app-github.md) — Setup GitHub OAuth App
- [fluxo-de-o-auth-com-git-hub](references/fluxo-de-o-auth-com-git-hub.md) — Fluxo OAuth completo (backend)
- [rota-autenticacao-com-github](references/rota-autenticacao-com-github.md) — Rota callback OAuth no Fastify
- [autenticacao-via-git-hub](references/autenticacao-via-git-hub.md) — OAuth flow no frontend Next.js

### Ambos (senha + OAuth)
Quando escolher: máxima flexibilidade, SaaS production-ready
→ Combine os dois blocos acima. A [associacao-automatica-via-e-mail](references/associacao-automatica-via-e-mail.md) lida com merge de contas pelo email.

### Como obter o perfil do usuário logado?
- [rota-perfil-do-usuario-logado-1](references/rota-perfil-do-usuario-logado-1.md) — Rota GET perfil do usuário autenticado
- [obtendo-usuario-autenticado](references/obtendo-usuario-autenticado.md) — Pattern de request autenticado no Next.js

### Como compartilhar auth entre packages?
- [criando-pacote-de-autenticacao](references/criando-pacote-de-autenticacao.md) — Package `@saas/auth` compartilhado no monorepo

---

## Como controlar quem pode fazer o quê? (RBAC)

### Preciso entender o modelo de permissões
- [introducao-82](references/introducao-82.md) — Overview arquitetural do projeto SaaS completo
- [saa-s-multi-tenant-and-rbac](references/saa-s-multi-tenant-and-rbac.md) — Arquitetura RBAC/ABAC multi-tenant
- [requisitos-da-aplicacao-2024](references/requisitos-da-aplicacao-2024.md) — Requisitos completos da app
- [introducao-ao-casl](references/introducao-ao-casl.md) — Introdução ao CASL

### Como definir as permissões?
- [criando-primeiras-permissoes](references/criando-primeiras-permissoes.md) — Primeiras abilities com CASL
- [criando-tipagem-das-subjects](references/criando-tipagem-das-subjects.md) — Type-safe subjects
- [definindo-permissoes-do-app](references/definindo-permissoes-do-app.md) — Arquitetura de permissões completa
- [otimizando-a-tipagem-das-permissoes](references/otimizando-a-tipagem-das-permissoes.md) — Zod-based permission typing

### Como mapear permissões por cargo?
- [permissoes-por-cargos](references/permissoes-por-cargos.md) — ADMIN, MEMBER, BILLING → abilities
- [permissoes-com-condicionais](references/permissoes-com-condicionais.md) — Permissões condicionais (ex: "só o autor pode editar")

### Como checar permissões no backend?
- [obtendo-afiliacao](references/obtendo-afiliacao.md) — getUserMembership para rotas protegidas
- [obtendo-permissoes-do-usuario](references/obtendo-permissoes-do-usuario.md) — Centralizar check com CASL ability

### Como checar permissões no frontend?
- [permissao-para-criar-projeto](references/permissao-para-criar-projeto.md) — Server Component permission guard
- [permissoes-nas-abas](references/permissoes-nas-abas.md) — Tab-level permission gating

---

## Como gerenciar organizações?

### Criar organização
- [rota-criacao-de-organizacao](references/rota-criacao-de-organizacao.md) — Rota POST com Zod + Prisma
- [action-criacao-de-organizacao](references/action-criacao-de-organizacao.md) — Server Action com validação
- [pagina-criar-organizacao](references/pagina-criar-organizacao.md) — Página de form

### Listar e visualizar organizações
- [listando-organizacoes](references/listando-organizacoes.md) — Listagem no frontend
- [listagem-e-detalhe-da-organizacao](references/listagem-e-detalhe-da-organizacao.md) — Rotas GET list + detail

### Editar organização
- [edicao-da-organizacao](references/edicao-da-organizacao.md) — Form de edição com Server Actions
- [rota-atualizar-organizacao](references/rota-atualizar-organizacao.md) — Rota PUT com CASL check
- [pagina-configuracoes-da-org](references/pagina-configuracoes-da-org.md) — Settings page com permission sections

### Transferir ownership
- [rota-transferir-organizacao](references/rota-transferir-organizacao.md) — Transfer ownership entre membros

### Encerrar organização
- [rota-encerrar-organizacao](references/rota-encerrar-organizacao.md) — DELETE com CASL permission check

### Como o usuário troca entre organizações?
- [componente-organization-switcher](references/componente-organization-switcher.md) — Dropdown switcher com shadcn/ui
- [exibindo-organizacao-ativa](references/exibindo-organizacao-ativa.md) — Sync URL state ↔ cookies via middleware

### Billing da organização
- [rota-dados-de-faturamento](references/rota-dados-de-faturamento.md) — Contagem de recursos por org
- [tabela-de-fatura-billing](references/tabela-de-fatura-billing.md) — Tabela de preços com shadcn/ui

---

## Como gerenciar membros e convites?

### Preciso convidar novos membros

#### Como funciona o fluxo de convite?
- [rota-criacao-de-convites](references/rota-criacao-de-convites.md) — POST convite (email + role)
- [convidar-novo-usuario](references/convidar-novo-usuario.md) — Form inline email + role
- [rota-convites-pendentes](references/rota-convites-pendentes.md) — Listar convites pendentes do usuário

#### Como o convidado aceita?
- [rota-aceitar-convite](references/rota-aceitar-convite.md) — Rota backend de aceite
- [action-aceitar-convite](references/action-aceitar-convite.md) — Server Action com multi-auth-state
- [pagina-aceitar-convite](references/pagina-aceitar-convite.md) — Página de aceite + routing
- [aceitando-e-rejeitando-convites](references/aceitando-e-rejeitando-convites.md) — Pattern completo accept/reject

#### E se o convite for pra outro email?
- [lidando-com-convite-p-outro-e-mail](references/lidando-com-convite-p-outro-e-mail.md) — Email mismatch handling

#### E rejeitar ou revogar convite?
- [rota-rejeitar-convite](references/rota-rejeitar-convite.md) — Rota de rejeição
- [rota-deletar-convite](references/rota-deletar-convite.md) — Revogar convite (admin)
- [rota-detalhes-do-convite](references/rota-detalhes-do-convite.md) — Detalhes sem org scope

#### Como listar convites?
- [listagem-de-convites](references/listagem-de-convites.md) — UI de convites + revogação
- [rota-listagem-de-convites](references/rota-listagem-de-convites.md) — GET convites no Fastify
- [estrutura-de-convites-pendentes](references/estrutura-de-convites-pendentes.md) — Popover de pending invites

### Preciso gerenciar membros existentes

#### Como listar membros?
- [rota-membros-da-organizacao](references/rota-membros-da-organizacao.md) — GET members com avatars
- [listagem-de-membros-2](references/listagem-de-membros-2.md) — Página com avatars, roles, actions

#### Como alterar o cargo de um membro?
- [atualizar-cargo-do-membro](references/atualizar-cargo-do-membro.md) — Role selector com permission gate
- [rota-atualizar-membro](references/rota-atualizar-membro.md) — PUT role update no Fastify

#### Como remover um membro?
- [action-remover-membro](references/action-remover-membro.md) — Server Action de remoção
- [rota-remover-membro](references/rota-remover-membro.md) — DELETE member no Fastify

### Como associar membros automaticamente pelo domínio de email?
- [associacao-automatica-via-e-mail](references/associacao-automatica-via-e-mail.md) — Auto-join org pelo domínio do email

---

## Como gerenciar projetos dentro da organização?

### Criar projeto
- [rota-criacao-de-projetos](references/rota-criacao-de-projetos.md) — POST com RBAC check
- [action-criacao-de-projeto](references/action-criacao-de-projeto.md) — Server Action org-scoped
- [pagina-criar-projeto](references/pagina-criar-projeto.md) — Form page

### Listar projetos
- [rota-listagem-de-projetos](references/rota-listagem-de-projetos.md) — GET projetos com RBAC
- [listagem-de-projetos-1](references/listagem-de-projetos-1.md) — Dashboard page

### Visualizar detalhes
- [rota-detalhes-do-projeto](references/rota-detalhes-do-projeto.md) — GET single project

### Atualizar projeto
- [rota-atualizar-projeto](references/rota-atualizar-projeto.md) — PUT com ownership check

### Remover projeto
- [rota-remover-projeto](references/rota-remover-projeto.md) — DELETE com ownership verification

### Como trocar entre projetos?
- [componente-project-switcher](references/componente-project-switcher.md) — Client Component switcher
- [listando-projetos-no-dropdown](references/listando-projetos-no-dropdown.md) — Dropdown com dynamic routing

### Como criar projeto via modal?
- [modal-de-criacao-de-projeto](references/modal-de-criacao-de-projeto.md) — Intercepting routes + modal

---

## Como lidar com forms e Server Actions?

### Preciso criar forms com validação
- [utilizando-server-actions](references/utilizando-server-actions.md) — Server Actions pattern
- [usando-o-hook-use-action-state](references/usando-o-hook-use-action-state.md) — useActionState hook
- [criando-hook-use-form-state](references/criando-hook-use-form-state.md) — Custom useFormState hook
- [estados-de-erro-do-formulario](references/estados-de-erro-do-formulario.md) — Standardized error handling
- [evitando-reset-do-formulario](references/evitando-reset-do-formulario.md) — Prevent form reset (React 19)

---

## Que padrões de UI usar?

### Navigation e layout
- [navegacao-do-app-por-abas](references/navegacao-do-app-por-abas.md) — Tab navigation + active link
- [componente-header-8](references/componente-header-8.md) — Layout autenticado + header
- [temas-dark-light-com-next-themes](references/temas-dark-light-com-next-themes.md) — Dark/light theme switching

### Interception + Parallel Routes
Quando escolher: modais que preservam contexto, navegação soft
- [interception-routes-no-next-js](references/interception-routes-no-next-js.md) — Intercepting routes
- [parallel-routes-no-next-js](references/parallel-routes-no-next-js.md) — Parallel route slots
- [comportamento-do-sheet](references/comportamento-do-sheet.md) — Sheet/modal com interception

---

## Como fazer deploy?

### Onde hospedar o backend?
- [opcoes-de-deploy-back-end](references/opcoes-de-deploy-back-end.md) — Comparação de plataformas
- [deploy-do-back-end](references/deploy-do-back-end.md) — Deploy no Render (Node.js + monorepo)

### Onde hospedar o frontend?
- [opcoes-de-deploy-front-end](references/opcoes-de-deploy-front-end.md) — Comparação de hosting
- [deploy-do-front-end](references/deploy-do-front-end.md) — Deploy na Vercel (TurboRepo)
- [testando-app-front-end](references/testando-app-front-end.md) — Teste pós-deploy + domínio

### Setup de infra
- [setup-github-e-database](references/setup-github-e-database.md) — GitHub repo + Neon Postgres

---

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 1 (DDD)** → "Estou começando?" + "Como controlar acesso?" para modelar domínio multi-tenant
- **Fase 2 (Architecture)** → "Como os usuários se autenticam?" + "Como controlar quem pode fazer o quê?"
- **Fase 3 (Implementação)** → Siga o ramo relevante por feature (orgs, members, projects)
- **Fase 4 (Validação)** → Cross-reference para testes e qualidade

## Cross-References — Decision Coverage

Quando este router não cobre uma decisão, delegue para:

| Decisão | Delegue para | Motivo |
|---------|-------------|--------|
| Testes (Jest/Playwright) | [rs-testes-e](../rs-testes-e/SKILL.md) | Unit + E2E testing |
| Styling (Tailwind profundo) | [rs-masterizando](../rs-masterizando/SKILL.md) | Tailwind CSS patterns |
| Clean code (naming, SOLID) | [rs-clean-code](../rs-clean-code/SKILL.md) | Premissa de escrita |
| Node.js profundo (streams, DDD) | [rs-node-js](../rs-node-js/SKILL.md) | Patterns avançados |
| Next.js profundo (SSR, cache) | [rs-next-js](../rs-next-js/SKILL.md) | Rendering strategies |
| Docker/K8s/CI | [rs-devops](../rs-devops/SKILL.md) | Infrastructure |
| Segurança (XSS, CSRF) | [rs-seguranca-para](../rs-seguranca-para/SKILL.md) | Security hardening |
