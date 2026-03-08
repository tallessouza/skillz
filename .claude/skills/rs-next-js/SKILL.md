---
name: rs-next-js
description: "Enforces Next.js best practices when building pages with App Router or Pages Router, implementing SSR/SSG/ISR rendering strategies, creating Server Components and Server Actions, configuring SEO metadata, setting up E2E tests with Cypress, or structuring layouts and routing. Make sure to use this skill whenever writing Next.js routes, fetching data in server components, implementing cache strategies, creating loading states, building forms with server actions, or deploying to Vercel. Not for backend-only APIs without Next.js, pure React SPA without Next.js, or non-JavaScript frameworks."
---

# Next.js — Decision Tree Router

> Siga a arvore de decisao para chegar na skill certa. 174 skills organizadas por perguntas que um desenvolvedor faria naturalmente.

## Tracer Bullet — Caminho Rapido

```
Projeto novo?         → setup-inicial-next-js.md → instalacao-shadcn-ui.md → configurando-es-lint-prettier-e-lefthook.md
Pagina nova?          → roteamento-e-layouts-no-next-js.md → app-router-e-testes-rotas-e-layouts-mkv-mp-4.md
Buscar dados?         → app-router-e-testes-fetch-de-dados-nos-componentes.md → cache-no-next-js.md
Formulario?           → criando-a-server-action.md → criando-o-schema-do-appointment-form.md
Deploy?               → fazendo-o-deploy-1.md → finalizando-o-deploy.md
```

---

## Decision Tree

### Q1: O que voce esta fazendo com Next.js?

---

### 1. Entendendo Next.js / Conceitos Fundamentais?

> Precisa entender o que e Next.js, por que usar, ou como funciona a arquitetura?

- [o-que-e-o-next-js](references/o-que-e-o-next-js.md) — O que e Next.js, SPA vs SSR, modelo mental
- [app-router-e-testes-arquitetura-do-next-js](references/app-router-e-testes-arquitetura-do-next-js.md) — Arquitetura SSR, BFF layer, code splitting
- [app-router-e-testes-arvore-de-componentes-no-next-js](references/app-router-e-testes-arvore-de-componentes-no-next-js.md) — Arvore de Server/Client Components, children pattern
- [o-que-e-seo](references/o-que-e-seo.md) — Fundamentos de SEO e por que Next.js ajuda
- [seo-e-core-web-vitals](references/seo-e-core-web-vitals.md) — Core Web Vitals e metricas de performance
- [client-e-server-components](references/client-e-server-components.md) — Diferenca entre client e server components
- [entendendo-os-react-server-components](references/entendendo-os-react-server-components.md) — React Server Components em profundidade
- [entendendo-sobre-os-arquivos-especiais-e-client-components](references/entendendo-sobre-os-arquivos-especiais-e-client-components.md) — Arquivos especiais (layout, page, loading, error) e client components

---

### 2. Configurando um projeto novo?

> Setup inicial, instalacao, configuracao de ferramentas.

#### Q2a: Qual router vai usar?

**App Router (recomendado):**
- [app-router-e-testes-criando-projeto-next-js-1](references/app-router-e-testes-criando-projeto-next-js-1.md) — Criando projeto Next.js com App Router
- [setup-inicial-next-js](references/setup-inicial-next-js.md) — Setup Next.js + Docker Compose + TypeScript
- [setup-do-projeto-next-js-1](references/setup-do-projeto-next-js-1.md) — Setup de projeto Next.js padrao
- [app-router-e-testes-criando-estrutura-do-app](references/app-router-e-testes-criando-estrutura-do-app.md) — Estruturando pastas do App Router

**Pages Router:**
- [instalacao-2](references/instalacao-2.md) — Instalacao Next.js com Pages Router
- [conhecendo-o-projeto-2032](references/conhecendo-o-projeto-2032.md) — Setup landing page + blog com Pages Router

**Projeto dashboard/agendamentos:**
- [conhecendo-o-projeto-2036](references/conhecendo-o-projeto-2036.md) — Setup dashboard pet shop (App Router + Prisma + Postgres)

#### Q2b: Precisa configurar ferramentas de qualidade?
- [configurando-es-lint-prettier-e-lefthook](references/configurando-es-lint-prettier-e-lefthook.md) — ESLint, Prettier e Lefthook (git hooks)
- [app-router-e-testes-variaveis-ambiente-client-e-server](references/app-router-e-testes-variaveis-ambiente-client-e-server.md) — Variaveis ambiente client vs server

#### Q2c: Precisa configurar styling/design system?
- [instalacao-shadcn-ui](references/instalacao-shadcn-ui.md) — Setup shadcn/ui
- [iniciando-nosso-system-design](references/iniciando-nosso-system-design.md) — Fundacao do design system com shadcn/ui
- [adicionando-style-guide](references/adicionando-style-guide.md) — Adicionando style guide ao projeto
- [instalando-o-tailwind-css-v-3-1](references/instalando-o-tailwind-css-v-3-1.md) — Tailwind CSS v3 no Next.js (→ ver tambem [rs-masterizando](../rs-masterizando/SKILL.md))
- [adicionando-a-nova-pasta-no-tailwind](references/adicionando-a-nova-pasta-no-tailwind.md) — Configurando content paths do Tailwind
- [ajustando-as-fontes](references/ajustando-as-fontes.md) — Configurando fontes no Next.js

#### Q2d: Precisa configurar banco de dados / API?
- [instalando-e-configurando-o-prisma-2](references/instalando-e-configurando-o-prisma-2.md) — Setup Prisma + Postgres no Next.js
- [setup-da-api-hono-com-drizzle-e-better-auth](references/setup-da-api-hono-com-drizzle-e-better-auth.md) — API Hono + Drizzle + BetterAuth dentro do Next.js
- [setup-do-react-query](references/setup-do-react-query.md) — Configurando TanStack React Query

#### Q2e: Precisa configurar Docker?
- [entendendo-o-que-e-o-docker](references/entendendo-o-que-e-o-docker.md) — O que e Docker e por que usar
- [entendendo-o-docker-compose-1](references/entendendo-o-docker-compose-1.md) — Docker Compose para desenvolvimento
- [instalando-o-docker-client](references/instalando-o-docker-client.md) — Instalando Docker Desktop

#### Q2f: Precisa configurar ContentLayer (blog Markdown)?
- [instalacao-e-configuracao](references/instalacao-e-configuracao.md) — Setup ContentLayer com Next.js

---

### 3. Roteamento, layouts e navegacao?

> Criando rotas, layouts, paginas especiais, navegacao.

#### Q3a: Qual sistema de rotas?

**App Router:**
- [roteamento-e-layouts-no-next-js](references/roteamento-e-layouts-no-next-js.md) — Roteamento e layouts no App Router
- [app-router-e-testes-rotas-e-layouts-mkv-mp-4](references/app-router-e-testes-rotas-e-layouts-mkv-mp-4.md) — Rotas e layouts (video)
- [app-router-e-testes-criando-layout-da-aplicacao](references/app-router-e-testes-criando-layout-da-aplicacao.md) — Criando layout da aplicacao
- [app-router-e-testes-grupos-e-rotas-dinamicas](references/app-router-e-testes-grupos-e-rotas-dinamicas.md) — Grupos de rotas e rotas dinamicas
- [parallel-e-intercepting-routes](references/parallel-e-intercepting-routes.md) — Parallel e intercepting routes
- [entendendo-o-roteamento-do-next-js](references/entendendo-o-roteamento-do-next-js.md) — Entendendo roteamento do Next.js

**Pages Router:**
- [layout](references/layout.md) — Layout pattern no Pages Router (_app.tsx)
- [diferencas-entre-app-e-document](references/diferencas-entre-app-e-document.md) — _app vs _document no Pages Router

**Migracao Pages → App Router:**
- [migrando-a-landing-page](references/migrando-a-landing-page.md) — Migrando landing page para App Router
- [migrando-a-listagem-de-posts](references/migrando-a-listagem-de-posts.md) — Migrando listagem de posts para App Router

#### Q3b: Paginas especiais?
- [criando-a-pagina-404-customizada](references/criando-a-pagina-404-customizada.md) — Pagina 404 customizada
- [criando-o-error](references/criando-o-error.md) — Error boundary (error.tsx)
- [criando-o-loading-tsx](references/criando-o-loading-tsx.md) — Loading state (loading.tsx)

#### Q3c: Navegacao e links?
- [componentes-link-e-image](references/componentes-link-e-image.md) — Componentes Link e Image do Next.js
- [componente-active-link-1](references/componente-active-link-1.md) — ActiveLink component
- [criando-o-navigation-button](references/criando-o-navigation-button.md) — Navigation button component

---

### 4. Renderizacao e data fetching?

> SSR, SSG, ISR, Server Components, fetch, cache.

#### Q4a: Qual estrategia de renderizacao?

**Conceitos gerais:**
- [ssr-ssg-e-isr](references/ssr-ssg-e-isr.md) — SSR, SSG e ISR (conceitos)
- [metodos-de-renderizacao-do-next-js](references/metodos-de-renderizacao-do-next-js.md) — CSR, SSR, SSG, ISR no Pages Router

**App Router (Server Components):**
- [app-router-e-testes-react-server-components](references/app-router-e-testes-react-server-components.md) — React Server Components
- [entendendo-ssg-e-isr-na-app-router](references/entendendo-ssg-e-isr-na-app-router.md) — SSG e ISR na App Router
- [app-router-e-testes-geracao-estatica-na-build](references/app-router-e-testes-geracao-estatica-na-build.md) — Geracao estatica na build
- [partial-pre-rendering-suspense-api](references/partial-pre-rendering-suspense-api.md) — Partial pre-rendering + Suspense API

**Pages Router (getStaticProps/getServerSideProps):**
- [aplicando-ssg-no-blog](references/aplicando-ssg-no-blog.md) — SSG com getStaticProps no blog
- [aplicando-ssg-no-post](references/aplicando-ssg-no-post.md) — SSG com getStaticPaths/getStaticProps em rotas dinamicas

#### Q4b: Como buscar dados?

**Server Components (App Router):**
- [app-router-e-testes-fetch-de-dados-nos-componentes](references/app-router-e-testes-fetch-de-dados-nos-componentes.md) — Fetch em Server Components
- [app-router-e-testes-fetch-de-produtos-na-home](references/app-router-e-testes-fetch-de-produtos-na-home.md) — Fetch de produtos na home
- [app-router-e-testes-fetch-de-dados-do-produto](references/app-router-e-testes-fetch-de-dados-do-produto.md) — Fetch de dados do produto
- [app-router-e-testes-buscando-produtos-da-api-4](references/app-router-e-testes-buscando-produtos-da-api-4.md) — Buscando produtos da API
- [app-router-e-testes-criando-fetch-api-wrapper](references/app-router-e-testes-criando-fetch-api-wrapper.md) — Criando fetch API wrapper
- [buscando-issues-do-board](references/buscando-issues-do-board.md) — Fetch com validacao Zod em server components
- [app-router-e-testes-api-busca-de-produtos](references/app-router-e-testes-api-busca-de-produtos.md) — API de busca de produtos

**React Query / Client-side:**
- [carregamento-das-interacoes-na-issue](references/carregamento-das-interacoes-na-issue.md) — React Query + Suspense para interacoes
- [carregando-interacoes-no-board](references/carregando-interacoes-no-board.md) — Carregando interacoes no board

**Route Handlers:**
- [app-router-e-testes-route-handlers-no-next](references/app-router-e-testes-route-handlers-no-next.md) — Route handlers no Next.js

#### Q4c: Como funciona cache / revalidacao?
- [cache-no-next-js](references/cache-no-next-js.md) — useCache, cacheLife, cacheTag, updateTag
- [app-router-e-testes-cache-e-memoizacao](references/app-router-e-testes-cache-e-memoizacao.md) — Cache e memoizacao no App Router
- [atualizacao-de-cache-dos-likes](references/atualizacao-de-cache-dos-likes.md) — Optimistic cache update com TanStack Query
- [utilizando-o-revalidate-path](references/utilizando-o-revalidate-path.md) — revalidatePath apos mutations

#### Q4d: Loading states e Suspense?
- [app-router-e-testes-suspense-api-no-react](references/app-router-e-testes-suspense-api-no-react.md) — Suspense API no React
- [app-router-e-testes-loading-e-streaming-ssr](references/app-router-e-testes-loading-e-streaming-ssr.md) — Loading e Streaming SSR
- [app-router-e-testes-loading-da-home](references/app-router-e-testes-loading-da-home.md) — Loading skeleton na home
- [app-router-e-testes-loading-da-busca](references/app-router-e-testes-loading-da-busca.md) — Loading state na busca
- [loading-state-da-pagina-de-issue](references/loading-state-da-pagina-de-issue.md) — Loading state na pagina de issue

#### Q4e: Client Components e boundaries?
- [app-router-e-testes-client-boundaries-e-encadeamentop](references/app-router-e-testes-client-boundaries-e-encadeamentop.md) — Client boundaries e encadeamento
- [app-router-e-testes-abstraindo-client-components](references/app-router-e-testes-abstraindo-client-components.md) — Abstraindo client components
- [app-router-e-testes-contexto-do-carrinho](references/app-router-e-testes-contexto-do-carrinho.md) — Contexto React no App Router (carrinho)

---

### 5. Server Actions e formularios?

> Mutations, formularios, validacao, submit.

#### Q5a: O que sao Server Actions?
- [o-que-sao-server-actions](references/o-que-sao-server-actions.md) — Conceito de Server Actions

#### Q5b: Criando Server Actions?
- [criando-a-server-action](references/criando-a-server-action.md) — Criando uma Server Action
- [criando-server-action-para-a-edicao](references/criando-server-action-para-a-edicao.md) — Server Action para edicao
- [refatorando-a-server-action](references/refatorando-a-server-action.md) — Refatorando Server Actions (DRY)

#### Q5c: Formularios com validacao?
- [criando-o-schema-do-appointment-form](references/criando-o-schema-do-appointment-form.md) — Schema Zod + React Hook Form
- [criando-a-base-do-appointment-form](references/criando-a-base-do-appointment-form.md) — Base do formulario com Dialog + shadcn/ui
- [criando-os-primeiros-inputs](references/criando-os-primeiros-inputs.md) — Criando inputs do formulario
- [finalizando-o-visual-do-appointment-form](references/finalizando-o-visual-do-appointment-form.md) — Finalizando visual do formulario
- [criando-a-funcao-de-submit](references/criando-a-funcao-de-submit.md) — Funcao de submit com date/time + toast
- [adicionando-e-configurando-zod](references/adicionando-e-configurando-zod.md) — Adicionando e configurando Zod

#### Q5d: Formulario de busca?
- [app-router-e-testes-formulario-de-busca](references/app-router-e-testes-formulario-de-busca.md) — Formulario de busca
- [app-router-e-testes-pagina-de-busca-1](references/app-router-e-testes-pagina-de-busca-1.md) — Pagina de busca

#### Q5e: Inputs especializados (data, telefone, calendario)?
- [criando-o-date-picker](references/criando-o-date-picker.md) — DatePicker component
- [melhorando-o-date-picker](references/melhorando-o-date-picker.md) — Melhorias no DatePicker
- [adicionando-o-calendar](references/adicionando-o-calendar.md) — Adicionando Calendar component
- [criando-o-input-de-calendario](references/criando-o-input-de-calendario.md) — Input de calendario
- [criando-o-input-de-telefone-com-mascara](references/criando-o-input-de-telefone-com-mascara.md) — Input de telefone com mascara (React iMask)
- [criando-o-select-de-data-parte-01](references/criando-o-select-de-data-parte-01.md) — Select de data parte 1 (time slots)
- [criando-o-select-de-data-parte-02](references/criando-o-select-de-data-parte-02.md) — Select de data parte 2

#### Q5f: Comentarios e interacoes?
- [formulario-de-comentarios-2024](references/formulario-de-comentarios-2024.md) — Formulario de comentarios
- [criacao-de-comentarios](references/criacao-de-comentarios.md) — Criacao de comentarios
- [listagem-de-comentarios](references/listagem-de-comentarios.md) — Listagem de comentarios
- [funcionalidade-de-like](references/funcionalidade-de-like.md) — Funcionalidade de like (optimistic UI)

#### Q5g: CRUD completo (agendamentos)?
- [listando-os-agendamentos](references/listando-os-agendamentos.md) — Listando agendamentos + error handling
- [atualizando-a-lista-de-agendamentos](references/atualizando-a-lista-de-agendamentos.md) — Atualizando lista de agendamentos
- [editando-um-agendamento](references/editando-um-agendamento.md) — Editando um agendamento
- [criando-a-funcionalidade-de-delecao-de-um-agendamento](references/criando-a-funcionalidade-de-delecao-de-um-agendamento.md) — Deletando agendamento (Alert Dialog + Server Action)
- [bloqueando-horarios-ja-agendados](references/bloqueando-horarios-ja-agendados.md) — Bloqueando horarios ja agendados
- [carregando-os-horarios](references/carregando-os-horarios.md) — Carregando horarios disponiveis
- [carregando-horarios-para-outros-dias](references/carregando-horarios-para-outros-dias.md) — Carregando horarios para outros dias
- [criando-logica-para-os-periodos](references/criando-logica-para-os-periodos.md) — Logica de periodos (manha, tarde, noite)

---

### 6. Paginas dinamicas e busca?

> Rotas dinamicas, searchParams, modais, listagens.

- [criando-a-pagina-de-post](references/criando-a-pagina-de-post.md) — Pagina dinamica de post
- [pagina-post-1](references/pagina-post-1.md) — Pagina de post (Pages Router)
- [app-router-e-testes-pagina-detalhe-do-produto](references/app-router-e-testes-pagina-detalhe-do-produto.md) — Pagina detalhe do produto
- [app-router-e-testes-pagina-home-2](references/app-router-e-testes-pagina-home-2.md) — Pagina home
- [listagem-dinamica-de-posts](references/listagem-dinamica-de-posts.md) — Listagem dinamica de posts
- [busca-dinamica-1](references/busca-dinamica-1.md) — Busca com searchParams
- [search-parameters-com-nuqs](references/search-parameters-com-nuqs.md) — URL state com nuqs
- [aplicando-filtro-na-listagem](references/aplicando-filtro-na-listagem.md) — Filtro na listagem
- [criando-a-funcionalidade-de-busca](references/criando-a-funcionalidade-de-busca.md) — Funcionalidade de busca client-side
- [finalizando-o-seach](references/finalizando-o-seach.md) — Finalizando a busca
- [modal-do-detalhe-da-issue](references/modal-do-detalhe-da-issue.md) — Modal com intercepting routes
- [pagina-de-issue-e-deduplicacao](references/pagina-de-issue-e-deduplicacao.md) — Pagina de issue e deduplicacao de dados

---

### 7. UI Components e styling?

> Componentes reutilizaveis, header, footer, cards, secoes.

#### Q7a: Layout e estrutura?
- [componente-header-9](references/componente-header-9.md) — Componente Header
- [app-router-e-testes-componente-header-7](references/app-router-e-testes-componente-header-7.md) — Header (App Router + testes)
- [componente-footer](references/componente-footer.md) — Componente Footer
- [estrutura-do-cabecalho](references/estrutura-do-cabecalho.md) — Estrutura do cabecalho
- [melhorias-no-layout](references/melhorias-no-layout.md) — Melhorias no layout

#### Q7b: Cards e listagens?
- [componente-post-card](references/componente-post-card.md) — PostCard component
- [componete-post-grid-card](references/componete-post-grid-card.md) — PostGridCard component
- [adicionando-informacoes-dinamicas-ao-post-card](references/adicionando-informacoes-dinamicas-ao-post-card.md) — Informacoes dinamicas no PostCard
- [estrutura-dos-cards](references/estrutura-dos-cards.md) — Estrutura de cards
- [criando-o-appointment-card](references/criando-o-appointment-card.md) — AppointmentCard component
- [continuando-o-appointment-card](references/continuando-o-appointment-card.md) — Continuacao do AppointmentCard

#### Q7c: Secoes de landing page?
- [secao-hero](references/secao-hero.md) — Hero section
- [secao-feature](references/secao-feature.md) — Feature section com cards
- [secao-customer-story](references/secao-customer-story.md) — Customer story section (data-driven)
- [secao-call-to-action](references/secao-call-to-action.md) — Call to Action section
- [secao-support](references/secao-support.md) — Support section com card grid
- [componentes-de-secao](references/componentes-de-secao.md) — Compound section components
- [botoes-da-secao-hero](references/botoes-da-secao-hero.md) — Botoes da hero section
- [iniciando-a-home](references/iniciando-a-home.md) — Iniciando a home page
- [continuando-a-home](references/continuando-a-home.md) — Continuando a home page

#### Q7d: Componentes de UI especificos?
- [componente-avatar-2024](references/componente-avatar-2024.md) — Avatar component
- [melhorias-no-componente-avatar](references/melhorias-no-componente-avatar.md) — Melhorias no Avatar
- [componente-markdown](references/componente-markdown.md) — Markdown renderer component
- [componente-period-section](references/componente-period-section.md) — PeriodSection component
- [criando-a-logo](references/criando-a-logo.md) — Extraindo Logo como componente reutilizavel
- [componente-de-menu-e-social-icons](references/componente-de-menu-e-social-icons.md) — Menu e Social Icons components
- [app-router-e-testes-adicionando-ao-carrinho-2](references/app-router-e-testes-adicionando-ao-carrinho-2.md) — Botao adicionar ao carrinho
- [app-router-e-testes-configurando-favicon](references/app-router-e-testes-configurando-favicon.md) — Configurando favicon

#### Q7e: Imagens e styling?
- [adicionando-imagens](references/adicionando-imagens.md) — Background images com Tailwind
- [efeitos-de-hover-e-focus](references/efeitos-de-hover-e-focus.md) — Hover e focus-visible patterns (→ ver tambem [rs-masterizando](../rs-masterizando/SKILL.md))
- [ajustes-visuais](references/ajustes-visuais.md) — Ajustes visuais gerais
- [ajustes-finais-8](references/ajustes-finais-8.md) — Ajustes finais do projeto

#### Q7f: Componente de busca (Search)?
- [iniciando-o-componente-seach](references/iniciando-o-componente-seach.md) — Iniciando componente Search
- [adicionando-imagens-e-estilos](references/adicionando-imagens-e-estilos.md) — Adicionando imagens e estilos

#### Q7g: Board / Kanban?
- [estrutura-do-board](references/estrutura-do-board.md) — Estrutura do board
- [estrutura-da-pagina-de-issue](references/estrutura-da-pagina-de-issue.md) — Estrutura da pagina de issue

---

### 8. SEO e metadata?

> Titulos, descricoes, OpenGraph, metadata dinamico.

- [metadados-das-paginas](references/metadados-das-paginas.md) — Metadata com template no layout
- [melhorando-o-seo-da-landing-page](references/melhorando-o-seo-da-landing-page.md) — SEO estatico na landing page
- [melhorando-o-seo-da-pagina-do-post](references/melhorando-o-seo-da-pagina-do-post.md) — generateMetadata dinamico para posts
- [melhorando-seo-na-pagina-de-listagem-de-posts](references/melhorando-seo-na-pagina-de-listagem-de-posts.md) — SEO na listagem de posts
- [app-router-e-testes-page-metadata-no-next-seo](references/app-router-e-testes-page-metadata-no-next-seo.md) — Page metadata / Next SEO
- [app-router-e-testes-gerando-opengraph-image](references/app-router-e-testes-gerando-opengraph-image.md) — Gerando OpenGraph image
- [gerando-open-graph-image](references/gerando-open-graph-image.md) — OpenGraph image generation

---

### 9. Compartilhamento?

> Share functionality, clipboard, social sharing.

- [iniciando-o-componente-de-compartilhamento](references/iniciando-o-componente-de-compartilhamento.md) — Componente de compartilhamento
- [criando-o-component-post-share](references/criando-o-component-post-share.md) — PostShare component
- [criando-o-hook-para-compatilhamento-parte-1](references/criando-o-hook-para-compatilhamento-parte-1.md) — Hook de compartilhamento parte 1
- [criando-o-hook-de-compartilhamento-parte-2](references/criando-o-hook-de-compartilhamento-parte-2.md) — Hook de compartilhamento parte 2
- [adicionando-funcionalidade-ao-compatilhar](references/adicionando-funcionalidade-ao-compatilhar.md) — useClipboard hook pattern

---

### 10. Blog / CMS / Conteudo?

> Blog, posts, ContentLayer, Markdown.

- [criando-a-pagina-de-blog](references/criando-a-pagina-de-blog.md) — Pagina de blog
- [criando-nosso-primeiro-post](references/criando-nosso-primeiro-post.md) — Primeiro post
- [adicionando-o-header](references/adicionando-o-header.md) — Header do blog
- [adicionando-o-rodape](references/adicionando-o-rodape.md) — Rodape do blog
- [adicionando-o-rodape-1](references/adicionando-o-rodape-1.md) — Rodape variacao
- [adicionando-conteudo-ao-aside-e-iniciando-o-main](references/adicionando-conteudo-ao-aside-e-iniciando-o-main.md) — Aside + main content
- [aplicando-estilos-na-secao-mais-lidas-da-semana](references/aplicando-estilos-na-secao-mais-lidas-da-semana.md) — Estilos na secao "mais lidas"
- [ajustando-o-conteudo-do-card](references/ajustando-o-conteudo-do-card.md) — Ajustando conteudo do card

---

### 11. Autenticacao?

> Login, logout, auth, BetterAuth.

- [autenticacao-com-better-auth](references/autenticacao-com-better-auth.md) — Setup BetterAuth no Next.js
- [encerramento-91](references/encerramento-91.md) — Logout com redirect (SSR auth state)

> Para seguranca avancada (XSS, CSRF, injection) → [rs-seguranca-para](../rs-seguranca-para/SKILL.md)

---

### 12. Testes e CI?

> Cypress, E2E, CI/CD.

- [app-router-e-testes-setup-do-cypress-e-2-e](references/app-router-e-testes-setup-do-cypress-e-2-e.md) — Setup Cypress E2E
- [app-router-e-testes-testando-a-busca](references/app-router-e-testes-testando-a-busca.md) — Testando a busca com Cypress
- [app-router-e-testes-testando-o-carrinho](references/app-router-e-testes-testando-o-carrinho.md) — Testando o carrinho com Cypress
- [app-router-e-testes-comandos-personalizados](references/app-router-e-testes-comandos-personalizados.md) — Comandos personalizados do Cypress
- [app-router-e-testes-workflow-de-ci-com-cypress](references/app-router-e-testes-workflow-de-ci-com-cypress.md) — CI workflow com Cypress

> Para testes unitarios, integracao e Playwright → [rs-testes-e](../rs-testes-e/SKILL.md)

---

### 13. Deploy?

> Vercel, deploy, ajustes de producao.

- [fazendo-o-deploy-1](references/fazendo-o-deploy-1.md) — Deploy na Vercel
- [iniciando-o-deploy-do-projeto](references/iniciando-o-deploy-do-projeto.md) — Iniciando deploy do projeto
- [finalizando-o-deploy](references/finalizando-o-deploy.md) — Finalizando o deploy
- [app-router-e-testes-ajustes-no-deploy-da-aplicacao](references/app-router-e-testes-ajustes-no-deploy-da-aplicacao.md) — Ajustes no deploy

---

### 14. Refatoracao e organizacao?

> Refactoring, estrutura de projeto, boas praticas.

- [refatoracoes](references/refatoracoes.md) — Templates pattern, co-location, barrel exports
- [app-router-e-testes-finalizacao-do-modulo-2](references/app-router-e-testes-finalizacao-do-modulo-2.md) — Finalizacao e revisao do modulo

---

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 2 (Architecture)** → Siga "Configurando um projeto novo?" e "Roteamento, layouts e navegacao?"
- **Fase 3 (Implementacao)** → Siga o ramo relevante por contexto
- **Fase 4 (Validacao)** → Siga "Testes e CI?" e "Deploy?"

## Cross-References — Decision Coverage

Quando este router nao cobre uma decisao, delegue para:

| Decisao | Delegue para | Motivo |
|---------|-------------|--------|
| D1_ARCHITECTURE (DDD/SOLID) | [rs-clean-code](../rs-clean-code/SKILL.md) | Premissa de escrita |
| D2_NODE_FRAMEWORK (Fastify/NestJS) | [rs-node-js](../rs-node-js/SKILL.md) | Backend separado |
| DX_TAILWIND (patterns avancados) | [rs-masterizando](../rs-masterizando/SKILL.md) | Tailwind CSS patterns |
| DX_TESTING (unit, Playwright) | [rs-testes-e](../rs-testes-e/SKILL.md) | Testes alem de Cypress |
| DX_SECURITY (XSS/CSRF) | [rs-seguranca-para](../rs-seguranca-para/SKILL.md) | Seguranca web |
