---
name: rs-saa-s
description: "Enforces SaaS multi-tenant best practices when building RBAC systems, implementing organization management, creating invitation flows, setting up monorepo architecture, deploying full-stack apps, or configuring CASL permissions. Make sure to use this skill whenever implementing multi-tenant SaaS with Next.js, Fastify API routes with Prisma, role-based access control, organization switchers, member management, or OAuth authentication flows. Not for simple CRUD apps without multi-tenancy, standalone React SPAs, or non-SaaS architectures."
---

# SaaS Multi-Tenant — Decision Tree Router

> Siga a árvore de decisão para chegar na skill certa. 105 skills organizadas em 8 domínios.

## Decision Tree

```
O que você está fazendo no SaaS?
│
├─ Setup / arquitetura / monorepo?
│  ├─ Visão geral SaaS → [next-js-rbac-introducao-82.md](references/next-js-rbac-introducao-82.md)
│  ├─ Multi-tenant & RBAC → [next-js-rbac-saa-s-multi-tenant-and-rbac.md](references/next-js-rbac-saa-s-multi-tenant-and-rbac.md)
│  ├─ Monorepo TurboRepo → [next-js-rbac-criando-monorepo-com-turbo-repo.md](references/next-js-rbac-criando-monorepo-com-turbo-repo.md)
│  ├─ Setup Fastify API → [next-js-rbac-setup-do-app-com-fastify.md](references/next-js-rbac-setup-do-app-com-fastify.md)
│  ├─ Setup banco de dados → [next-js-rbac-setup-do-banco-de-dados.md](references/next-js-rbac-setup-do-banco-de-dados.md)
│  ├─ Setup Next.js → [next-js-rbac-setup-do-projeto-next-js.md](references/next-js-rbac-setup-do-projeto-next-js.md)
│  └─ Swagger → [next-js-rbac-setup-do-swagger.md](references/next-js-rbac-setup-do-swagger.md)
│
├─ RBAC / permissões (CASL)?
│  ├─ Intro CASL → [next-js-rbac-introducao-ao-casl.md](references/next-js-rbac-introducao-ao-casl.md)
│  ├─ Primeiras permissões → [next-js-rbac-criando-primeiras-permissoes.md](references/next-js-rbac-criando-primeiras-permissoes.md)
│  ├─ Tipagem de subjects → [next-js-rbac-criando-tipagem-das-subjects.md](references/next-js-rbac-criando-tipagem-das-subjects.md)
│  ├─ Permissões por cargo → [next-js-rbac-permissoes-por-cargos.md](references/next-js-rbac-permissoes-por-cargos.md)
│  ├─ Permissões condicionais → [next-js-rbac-permissoes-com-condicionais.md](references/next-js-rbac-permissoes-com-condicionais.md)
│  └─ Permission guard (Server Component) → [next-js-rbac-permissao-para-criar-projeto.md](references/next-js-rbac-permissao-para-criar-projeto.md)
│
├─ Autenticação / OAuth?
│  ├─ Auth via senha (JWT) → [next-js-rbac-rota-autenticacao-via-senha.md](references/next-js-rbac-rota-autenticacao-via-senha.md)
│  ├─ OAuth GitHub → [next-js-rbac-fluxo-de-o-auth-com-git-hub.md](references/next-js-rbac-fluxo-de-o-auth-com-git-hub.md)
│  ├─ Middleware auth → [next-js-rbac-criando-middleware-de-autenticacao.md](references/next-js-rbac-criando-middleware-de-autenticacao.md)
│  ├─ Cadastro → [next-js-rbac-rota-cadastro-de-usuario.md](references/next-js-rbac-rota-cadastro-de-usuario.md)
│  ├─ Login com cookies → [next-js-rbac-realizando-login-do-usuario.md](references/next-js-rbac-realizando-login-do-usuario.md)
│  └─ Recuperação de senha → [next-js-rbac-rota-troca-de-senha.md](references/next-js-rbac-rota-troca-de-senha.md)
│
├─ Organizações (CRUD)?
│  ├─ Criar organização → [next-js-rbac-rota-criacao-de-organizacao.md](references/next-js-rbac-rota-criacao-de-organizacao.md)
│  ├─ Organization switcher → [next-js-rbac-componente-organization-switcher.md](references/next-js-rbac-componente-organization-switcher.md)
│  ├─ Membership resolution → [next-js-rbac-obtendo-afiliacao.md](references/next-js-rbac-obtendo-afiliacao.md)
│  ├─ Edição → [next-js-rbac-edicao-da-organizacao.md](references/next-js-rbac-edicao-da-organizacao.md)
│  ├─ Transferência → [next-js-rbac-rota-transferir-organizacao.md](references/next-js-rbac-rota-transferir-organizacao.md)
│  └─ Billing → [next-js-rbac-rota-dados-de-faturamento.md](references/next-js-rbac-rota-dados-de-faturamento.md)
│
├─ Membros / convites?
│  ├─ Criar convite → [next-js-rbac-rota-criacao-de-convites.md](references/next-js-rbac-rota-criacao-de-convites.md)
│  ├─ Aceitar convite → [next-js-rbac-rota-aceitar-convite.md](references/next-js-rbac-rota-aceitar-convite.md)
│  ├─ Listagem membros → [next-js-rbac-listagem-de-membros-2.md](references/next-js-rbac-listagem-de-membros-2.md)
│  ├─ Atualizar cargo → [next-js-rbac-atualizar-cargo-do-membro.md](references/next-js-rbac-atualizar-cargo-do-membro.md)
│  └─ Remover membro → [next-js-rbac-rota-remover-membro.md](references/next-js-rbac-rota-remover-membro.md)
│
├─ Projetos (CRUD)?
│  ├─ Criar projeto → [next-js-rbac-rota-criacao-de-projetos.md](references/next-js-rbac-rota-criacao-de-projetos.md)
│  ├─ Listagem → [next-js-rbac-listagem-de-projetos-1.md](references/next-js-rbac-listagem-de-projetos-1.md)
│  ├─ Project switcher → [next-js-rbac-componente-project-switcher.md](references/next-js-rbac-componente-project-switcher.md)
│  └─ Modal intercepting routes → [next-js-rbac-modal-de-criacao-de-projeto.md](references/next-js-rbac-modal-de-criacao-de-projeto.md)
│
├─ UI patterns / Server Actions?
│  ├─ Server Actions → [next-js-rbac-utilizando-server-actions.md](references/next-js-rbac-utilizando-server-actions.md)
│  ├─ useActionState → [next-js-rbac-usando-o-hook-use-action-state.md](references/next-js-rbac-usando-o-hook-use-action-state.md)
│  ├─ Interception routes → [next-js-rbac-interception-routes-no-next-js.md](references/next-js-rbac-interception-routes-no-next-js.md)
│  ├─ Parallel routes → [next-js-rbac-parallel-routes-no-next-js.md](references/next-js-rbac-parallel-routes-no-next-js.md)
│  └─ Navegação por abas → [next-js-rbac-navegacao-do-app-por-abas.md](references/next-js-rbac-navegacao-do-app-por-abas.md)
│
└─ Deploy?
   ├─ Backend (Render) → [next-js-rbac-deploy-do-back-end.md](references/next-js-rbac-deploy-do-back-end.md)
   ├─ Frontend (Vercel) → [next-js-rbac-deploy-do-front-end.md](references/next-js-rbac-deploy-do-front-end.md)
   └─ Setup GitHub + DB → [next-js-rbac-setup-github-e-database.md](references/next-js-rbac-setup-github-e-database.md)
```

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 1 (DDD)** → Siga "Setup / arquitetura" para entender domínio multi-tenant
- **Fase 2 (Architecture)** → Siga "RBAC / permissões" + "Autenticação"
- **Fase 3 (Implementação)** → Siga o ramo relevante por feature
