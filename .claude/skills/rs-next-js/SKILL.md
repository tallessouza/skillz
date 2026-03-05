---
name: rs-next-js
description: "Enforces Next.js best practices when building pages with App Router or Pages Router, implementing SSR/SSG/ISR rendering strategies, creating Server Components and Server Actions, configuring SEO metadata, setting up E2E tests with Cypress, or structuring layouts and routing. Make sure to use this skill whenever writing Next.js routes, fetching data in server components, implementing cache strategies, creating loading states, building forms with server actions, or deploying to Vercel. Not for backend-only APIs without Next.js, pure React SPA without Next.js, or non-JavaScript frameworks."
---

# Next.js — Decision Tree Router

> Siga a árvore de decisão para chegar na skill certa. 174 skills organizadas em 8 domínios.

## Decision Tree

```
O que você está fazendo com Next.js?
│
├─ Configurando projeto / rotas / layouts?
│  ├─ Criando projeto App Router → [app-router-e-testes-criando-projeto-next-js-1.md](references/app-router-e-testes-criando-projeto-next-js-1.md)
│  ├─ Estrutura de layouts → [app-router-e-testes-criando-layout-da-aplicacao.md](references/app-router-e-testes-criando-layout-da-aplicacao.md)
│  ├─ Rotas e layouts → [roteamento-e-layouts-no-next-js.md](references/roteamento-e-layouts-no-next-js.md)
│  ├─ Grupos e rotas dinâmicas → [app-router-e-testes-grupos-e-rotas-dinamicas.md](references/app-router-e-testes-grupos-e-rotas-dinamicas.md)
│  ├─ Parallel e intercepting routes → [parallel-e-intercepting-routes.md](references/parallel-e-intercepting-routes.md)
│  ├─ Página 404 customizada → [criando-a-pagina-404-customizada.md](references/criando-a-pagina-404-customizada.md)
│  ├─ Error boundary → [criando-o-error.md](references/criando-o-error.md)
│  ├─ Migrando Pages → App Router → [migrando-a-landing-page.md](references/migrando-a-landing-page.md)
│  └─ Variáveis ambiente → [app-router-e-testes-variaveis-ambiente-client-e-server.md](references/app-router-e-testes-variaveis-ambiente-client-e-server.md)
│
├─ Data fetching / rendering / cache?
│  ├─ SSR, SSG, ISR (conceitos) → [ssr-ssg-e-isr.md](references/ssr-ssg-e-isr.md)
│  ├─ SSG e ISR na App Router → [entendendo-ssg-e-isr-na-app-router.md](references/entendendo-ssg-e-isr-na-app-router.md)
│  ├─ Fetch em Server Components → [app-router-e-testes-fetch-de-dados-nos-componentes.md](references/app-router-e-testes-fetch-de-dados-nos-componentes.md)
│  ├─ Cache & memoization → [app-router-e-testes-cache-e-memoizacao.md](references/app-router-e-testes-cache-e-memoizacao.md)
│  ├─ Route handlers → [app-router-e-testes-route-handlers-no-next.md](references/app-router-e-testes-route-handlers-no-next.md)
│  ├─ Geração estática na build → [app-router-e-testes-geracao-estatica-na-build.md](references/app-router-e-testes-geracao-estatica-na-build.md)
│  ├─ Partial pre-rendering → [partial-pre-rendering-suspense-api.md](references/partial-pre-rendering-suspense-api.md)
│  └─ React Query setup → [setup-do-react-query.md](references/setup-do-react-query.md)
│
├─ Server Components vs Client Components?
│  ├─ React Server Components → [app-router-e-testes-react-server-components.md](references/app-router-e-testes-react-server-components.md)
│  ├─ Client boundaries → [app-router-e-testes-client-boundaries-e-encadeamentop.md](references/app-router-e-testes-client-boundaries-e-encadeamentop.md)
│  ├─ Abstraindo client components → [app-router-e-testes-abstraindo-client-components.md](references/app-router-e-testes-abstraindo-client-components.md)
│  ├─ Suspense API → [app-router-e-testes-suspense-api-no-react.md](references/app-router-e-testes-suspense-api-no-react.md)
│  ├─ Loading com skeleton → [app-router-e-testes-loading-da-home.md](references/app-router-e-testes-loading-da-home.md)
│  ├─ Streaming SSR → [app-router-e-testes-loading-e-streaming-ssr.md](references/app-router-e-testes-loading-e-streaming-ssr.md)
│  └─ Contexto React no App Router → [app-router-e-testes-contexto-do-carrinho.md](references/app-router-e-testes-contexto-do-carrinho.md)
│
├─ Server Actions / formulários?
│  ├─ O que são Server Actions → [o-que-sao-server-actions.md](references/o-que-sao-server-actions.md)
│  ├─ Criando Server Action → [criando-a-server-action.md](references/criando-a-server-action.md)
│  ├─ Schema com Zod + React Hook Form → [criando-o-schema-do-appointment-form.md](references/criando-o-schema-do-appointment-form.md)
│  ├─ Formulário de busca → [app-router-e-testes-formulario-de-busca.md](references/app-router-e-testes-formulario-de-busca.md)
│  ├─ Interface otimista (likes) → [funcionalidade-de-like.md](references/funcionalidade-de-like.md)
│  ├─ revalidatePath → [utilizando-o-revalidate-path.md](references/utilizando-o-revalidate-path.md)
│  └─ Server Action para edição → [criando-server-action-para-a-edicao.md](references/criando-server-action-para-a-edicao.md)
│
├─ Páginas / busca / rotas dinâmicas?
│  ├─ Página dinâmica → [criando-a-pagina-de-post.md](references/criando-a-pagina-de-post.md)
│  ├─ Busca com searchParams → [busca-dinamica-1.md](references/busca-dinamica-1.md)
│  ├─ URL state com nuqs → [search-parameters-com-nuqs.md](references/search-parameters-com-nuqs.md)
│  ├─ Modal com intercepting routes → [modal-do-detalhe-da-issue.md](references/modal-do-detalhe-da-issue.md)
│  └─ Listagem dinâmica → [listagem-dinamica-de-posts.md](references/listagem-dinamica-de-posts.md)
│
├─ UI components / styling?
│  ├─ shadcn/ui setup → [instalacao-shadcn-ui.md](references/instalacao-shadcn-ui.md)
│  ├─ Tailwind no Next.js → [instalando-o-tailwind-css-v-3-1.md](references/instalando-o-tailwind-css-v-3-1.md)
│  ├─ Compound components → [componentes-de-secao.md](references/componentes-de-secao.md)
│  ├─ Componente Header → [app-router-e-testes-componente-header-7.md](references/app-router-e-testes-componente-header-7.md)
│  ├─ ActiveLink component → [componente-active-link-1.md](references/componente-active-link-1.md)
│  └─ Link e Image do Next.js → [componentes-link-e-image.md](references/componentes-link-e-image.md)
│
├─ SEO / metadata?
│  ├─ O que é SEO → [o-que-e-seo.md](references/o-que-e-seo.md)
│  ├─ Metadata estática → [melhorando-o-seo-da-landing-page.md](references/melhorando-o-seo-da-landing-page.md)
│  ├─ generateMetadata dinâmico → [melhorando-o-seo-da-pagina-do-post.md](references/melhorando-o-seo-da-pagina-do-post.md)
│  ├─ OpenGraph image → [app-router-e-testes-gerando-opengraph-image.md](references/app-router-e-testes-gerando-opengraph-image.md)
│  └─ Core Web Vitals → [seo-e-core-web-vitals.md](references/seo-e-core-web-vitals.md)
│
└─ Testes / auth / deploy?
   ├─ Cypress E2E setup → [app-router-e-testes-setup-do-cypress-e-2-e.md](references/app-router-e-testes-setup-do-cypress-e-2-e.md)
   ├─ CI com Cypress → [app-router-e-testes-workflow-de-ci-com-cypress.md](references/app-router-e-testes-workflow-de-ci-com-cypress.md)
   ├─ BetterAuth → [autenticacao-com-better-auth.md](references/autenticacao-com-better-auth.md)
   ├─ Deploy na Vercel → [fazendo-o-deploy-1.md](references/fazendo-o-deploy-1.md)
   └─ Docker no Next.js → [entendendo-o-que-e-o-docker.md](references/entendendo-o-que-e-o-docker.md)
```

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 2 (Architecture)** → Siga "Configurando projeto / rotas / layouts"
- **Fase 3 (Implementação)** → Siga o ramo relevante por contexto
- **Fase 4 (Validação)** → Siga "Testes / auth / deploy"
