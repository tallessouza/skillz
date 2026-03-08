---
name: rs-frontend-decisions
description: "Guides frontend development decisions when building web interfaces with HTML, CSS, JavaScript, React, Next.js, or Tailwind CSS. Use when user asks to 'create a page', 'build a UI', 'add a component', 'style a layout', 'implement a form', 'manage state', 'add routing', 'optimize SEO', or any client-side development task. Walks through architectural decisions: rendering strategy, framework choice, styling approach, component design, state management, data fetching, forms, testing, security hardening, and deployment. Make sure to use this skill whenever starting a new frontend project, adding a major UI feature, or making architectural decisions about client-side code. Not for backend-only APIs, database schemas, DevOps infrastructure, or non-web platforms."
---

# Frontend — Fluxo de Decisoes

> Cada decisao de frontend segue: comece pelo mais simples que resolve, escale quando necessario.
> Este router e CROSS-CUTTING — referencia skills de multiplos routers por dominio.

> **Caminho rapido para app Next.js:**
> Next.js App Router → Tailwind + shadcn/ui → Server Components → Server Actions → Cypress E2E
> [setup-next](../rs-next-js/references/app-router-e-testes-criando-projeto-next-js-1.md) → [tailwind](../rs-next-js/references/instalando-o-tailwind-css-v-3-1.md) → [rsc](../rs-next-js/references/app-router-e-testes-react-server-components.md) → [actions](../rs-next-js/references/criando-a-server-action.md) → [cypress](../rs-next-js/references/app-router-e-testes-setup-do-cypress-e-2-e.md)

> **Caminho rapido para SPA React puro:**
> HTML/CSS/JS fundamentos → React + Vite → React Router → Context API → Styled Components
> [html-doc](../rs-full-stack/references/anatomia-de-um-documento-html.md) → [react](../rs-full-stack/references/conhecendo-o-react.md) → [router](../rs-full-stack/references/conhecendo-o-react-router.md) → [context](../rs-full-stack/references/0301-compreendendo-contexto-mkv-mp-4.md) → [components](../rs-full-stack/references/criando-um-componente.md)

> **Caminho rapido para SaaS frontend:**
> Next.js + Monorepo → shadcn/ui → Server Actions + useActionState → RBAC UI → Deploy Vercel
> [monorepo](../rs-saa-s/references/criando-monorepo-com-turbo-repo.md) → [shadcn](../rs-next-js/references/instalacao-shadcn-ui.md) → [actions](../rs-saa-s/references/utilizando-server-actions.md) → [rbac-ui](../rs-saa-s/references/permissao-para-criar-projeto.md) → [deploy](../rs-saa-s/references/deploy-do-front-end.md)

---

## Que tipo de frontend estou criando?

### Pagina estatica (HTML/CSS)
Quando escolher: landing page, portfolio, conteudo sem interatividade
- Siga para: [Como estruturar HTML?](#como-estruturar-html)
- Siga para: [Como estilizar?](#como-estilizar-com-css)

### SPA React (sem SSR)
Quando escolher: dashboard, app interno, prototipo rapido, sem SEO
- Siga para: [Como criar componentes React?](#como-criar-componentes-react)

### Next.js (SSR/SSG/ISR)
Quando escolher: SEO importa, performance, Server Components, app completa
- Siga para: [Como usar Next.js?](#como-usar-nextjs)

### SaaS multi-tenant (frontend)
Quando escolher: organizacoes, permissoes na UI, formularios complexos
- Siga para: [Como construir frontend SaaS?](#como-construir-frontend-saas)

---

## Como estruturar HTML?

### Documento e tags
- [Anatomia do documento](../rs-full-stack/references/anatomia-de-um-documento-html.md) — estrutura base
- [Anatomia das tags](../rs-full-stack/references/anatomia-das-tags-1.md) — abertura, fechamento, atributos
- [Aninhamento](../rs-full-stack/references/aninhamento-de-tags.md) — hierarquia de elementos
- [Atributos globais](../rs-full-stack/references/atributos-globais-1.md) — class, id, data-*
- [Atributos booleanos](../rs-full-stack/references/atributos-booleanos.md) — disabled, required
- [Caracteres reservados](../rs-full-stack/references/caracteres-reservados-1.md) — entidades HTML
- [Semantica](../rs-full-stack/references/desenhando-uma-pagina-web.md) — header, main, section, aside

### Formularios
- [HTML forms](../rs-full-stack/references/html-forms.md) — estrutura de formularios
- [Checkbox, radio, hidden](../rs-full-stack/references/checkbox-radio-e-hidden.md) — tipos de input
- [Button](../rs-full-stack/references/button-1.md) — tag button
- [Campos de endereco](../rs-full-stack/references/configurando-os-campos-de-endereco.md) — layout de form
- [Validacao CSS](../rs-full-stack/references/campos-das-informacoes-do-responsavel.md) — pseudo-classes

### Caminhos e links
- [Caminhos absolutos e relativos](../rs-full-stack/references/caminhos-absolutos-e-relativos.md) — paths
- [Caminhos no servidor](../rs-full-stack/references/caminhos-absolutos-e-relativos-em-um-servidor.md) — deploy

---

## Como estilizar com CSS?

### Fundamentos
- [Adicionando CSS](../rs-full-stack/references/adicionando-css-no-html.md) — link, style, inline
- [Anatomia CSS](../rs-full-stack/references/anatomia-1.md) — seletores, propriedades, valores
- [Cascading](../rs-full-stack/references/cascading.md) — especificidade e heranca
- [Box Model](../rs-full-stack/references/box-model-1.md) — margin, border, padding, content
- [Box Sizing](../rs-full-stack/references/box-sizing-1.md) — border-box vs content-box
- [Display](../rs-full-stack/references/display.md) — block, inline, flex, grid
- [Combinators](../rs-full-stack/references/combinators.md) — descendant, child, sibling
- [Cores e fundos](../rs-full-stack/references/cores-e-fundos.md) — color, background
- [Variaveis CSS](../rs-full-stack/references/criando-as-variaveis-de-cores-no-css.md) — custom properties

### Flexbox
- [Container, itens e eixo](../rs-full-stack/references/container-itens-e-eixo.md) — fundamentos
- [Align-items](../rs-full-stack/references/align-items.md) — alinhamento cross-axis

### CSS Grid
- [Explicando Grid](../rs-full-stack/references/explicando-o-css-grid.md) — conceito
- [Grid template columns](../rs-full-stack/references/grid-template-columns.md) — colunas
- [Grid template rows](../rs-full-stack/references/grid-template-rows.md) — linhas
- [Grid template areas](../rs-full-stack/references/grid-template-areas.md) — areas nomeadas
- [Grid column/row](../rs-full-stack/references/grid-column.md) — posicionamento
- [Grid ou Flex?](../rs-full-stack/references/grid-ou-flex.md) — quando usar cada um

### Responsividade
- [Media queries](../rs-full-stack/references/css-media-queries.md) — breakpoints
- [Evolucao media queries](../rs-full-stack/references/evolucao-dos-media-queries.md) — container queries
- [Dicas responsividade](../rs-full-stack/references/dicas-e-aprendizados.md) — boas praticas
- [Classes utilitarias](../rs-full-stack/references/adicionando-classes-utilitarias-parte-1.md) — utility-first

### Animacoes e transicoes
- [Transitions](../rs-full-stack/references/css-transition-01.md) — hover, focus
- [Transition timing](../rs-full-stack/references/css-transition-02.md) — ease, cubic-bezier
- [Transition shorthand](../rs-full-stack/references/css-transition-03.md) — acessibilidade
- [Keyframes](../rs-full-stack/references/css-animation-01-1.md) — animacoes complexas
- [Animation avancado](../rs-full-stack/references/css-animation-02-1.md) — iteration, direction

### Tailwind CSS (delegacao)
> Para Tailwind profundo (variants, dark mode, Radix, design system): [rs-masterizando](../rs-masterizando/SKILL.md)

#### Tailwind basico
- [Criando projeto](../rs-masterizando/references/o-tailwind-criando-projeto-com-tailwind.md) — setup
- [Fundamentos](../rs-masterizando/references/o-tailwind-fundamentos-do-tailwind.md) — classes utilitarias
- [Seletores e estados](../rs-masterizando/references/o-tailwind-seletores-e-estados.md) — hover, focus, group
- [Valores arbitrarios](../rs-masterizando/references/o-tailwind-valores-arbitrarios.md) — bracket syntax

#### Layout e formularios Tailwind
- [Estrutura layout](../rs-masterizando/references/o-tailwind-estrutura-do-layout.md) — page layout
- [Formulario](../rs-masterizando/references/o-tailwind-estrutura-do-formulario-1.md) — form layout
- [Campos grid](../rs-masterizando/references/o-tailwind-campos-do-formulario.md) — form fields

#### Sidebar e navegacao
- [Menu navegacao](../rs-masterizando/references/o-tailwind-menu-de-navegacao.md) — nav component
- [Sidebar collapsible](../rs-masterizando/references/o-tailwind-abertura-da-sidebar.md) — Radix
- [Responsividade sidebar](../rs-masterizando/references/o-tailwind-responsividade-da-sidebar.md) — mobile

#### Composition e variantes
- [Pattern composicao](../rs-masterizando/references/o-tailwind-pattern-de-composicao.md) — compound components
- [Tailwind Variants](../rs-masterizando/references/o-tailwind-variantes-de-botoes.md) — button variants
- [Slots API](../rs-masterizando/references/o-tailwind-variantes-com-slots.md) — slots pattern
- [Focus effects](../rs-masterizando/references/o-tailwind-criando-efeitos-de-foco.md) — focus rings

#### Dark mode
- [Dark mode setup](../rs-masterizando/references/o-tailwind-dark-mode-no-tailwind.md) — configuracao
- [Theme switcher](../rs-masterizando/references/o-tailwind-theme-switcher.md) — toggle

#### Responsividade Tailwind
- [Breakpoints](../rs-masterizando/references/o-tailwind-responsividade-e-breakpoints.md) — sm, md, lg
- [Formularios responsivos](../rs-masterizando/references/o-tailwind-responsividade-do-formulario.md) — grid

#### Animacoes Tailwind
- [Framer Motion](../rs-masterizando/references/o-tailwind-animacao-das-abas.md) — abas
- [Select animado](../rs-masterizando/references/o-tailwind-animando-abertura-dos-selects.md) — Radix
- [AutoAnimate](../rs-masterizando/references/o-tailwind-animando-portfolio.md) — listas

---

## Como usar JavaScript no frontend?

### Fundamentos
- [Conectando JS ao HTML](../rs-full-stack/references/conectando-javascript.md) — script tag
- [DOM](../rs-full-stack/references/dom.md) — Document Object Model
- [Query Selector](../rs-full-stack/references/query-selector-1.md) — selecao de elementos
- [Acessando elementos](../rs-full-stack/references/acessando-elementos-no-dom.md) — getElementById, etc
- [Eventos](../rs-full-stack/references/eventos-1.md) — addEventListener
- [Eventos de formulario](../rs-full-stack/references/eventos-de-formulario.md) — submit, change
- [Eventos de input](../rs-full-stack/references/eventos-em-input.md) — input, blur, focus
- [Capturando input](../rs-full-stack/references/capturando-o-evento-de-input.md) — value binding
- [Alterando estilos via DOM](../rs-full-stack/references/alterando-estilos-1.md) — classList, style

### Async e fetch
- [Promises](../rs-full-stack/references/conhecendo-promises-1.md) — conceito
- [Async/Await](../rs-full-stack/references/conhecendo-async-e-await.md) — sintaxe moderna
- [Fetch API](../rs-full-stack/references/utilizando-o-fetch.md) — GET requests
- [Fetch com POST](../rs-full-stack/references/fetch-com-post.md) — enviando dados
- [Event Loop](../rs-full-stack/references/conhecendo-o-event-loop.md) — como JS funciona

### Intl e formatacao
- [Intl API](../rs-full-stack/references/conhecendo-a-intl.md) — internacionalizacao
- [Formatando moeda](../rs-full-stack/references/formatando-a-moeda.md) — currency
- [Formatando data/hora](../rs-full-stack/references/formatando-uma-data-e-uma-hora.md) — date/time

### Modulos e bundlers
- [ES Modules](../rs-full-stack/references/boas-vindas-aos-modulos.md) — import/export
- [Bundlers](../rs-full-stack/references/conehcendo-os-bundlers.md) — conceito
- [Webpack config](../rs-full-stack/references/configurando-o-webpack.md) — setup
- [Carregando CSS](../rs-full-stack/references/carregando-o-css.md) — loaders
- [Babel](../rs-full-stack/references/configurando-e-utilizando-o-babel.md) — transpilacao

---

## Como criar componentes React?

### Primeiros passos
- [Conhecendo React](../rs-full-stack/references/conhecendo-o-react.md) — conceito
- [SPA vs Tradicional](../rs-full-stack/references/aplicacao-web-tradicional-vs-single-page-application.md) — arquitetura
- [Compreendendo componentes](../rs-full-stack/references/compreendendo-componentes.md) — conceito
- [Criando componente](../rs-full-stack/references/criando-um-componente.md) — primeiro componente
- [JSX](../rs-full-stack/references/jsx-4.md) — sintaxe

### Hooks
- [Introducao a hooks](../rs-full-stack/references/introducao-a-hooks.md) — conceito
- [useState e useEffect](../rs-full-stack/references/compreendendo-use-effect-e-use-state.md) — estado e efeitos
- [Custom hooks](../rs-full-stack/references/criando-seu-proprio-hook-2024.md) — reutilizacao
- [Context API](../rs-full-stack/references/0301-compreendendo-contexto-mkv-mp-4.md) — estado global
- [Context detalhado](../rs-full-stack/references/0302-contexto-em-detalhes-mkv-mp-4.md) — providers

### React Router
- [React Router](../rs-full-stack/references/conhecendo-o-react-router.md) — navegacao SPA

### Formularios
- [React Hook Form](../rs-full-stack/references/conhecendo-o-react-hook-form.md) — formularios
- [Componente input](../rs-full-stack/references/criando-componente-de-input-1.md) — input reutilizavel
- [Imutabilidade](../rs-full-stack/references/aplicando-imutabilidade.md) — estado imutavel

### Patterns de componentes (Clean Code)
- [Componentes puros](../rs-clean-code/references/componentes-puros.md) — sem side effects
- [Composicao vs customizacao](../rs-clean-code/references/composicao-vs-customizacao.md) — slots, children
- [Condicionais no render](../rs-clean-code/references/condicionais-no-render.md) — ternary, &&
- [Desacoplando componentes](../rs-clean-code/references/desacoplando-componentes.md) — separacao
- [Funcoes e eventos](../rs-clean-code/references/funcoes-e-eventos-no-react.md) — handlers

---

## Como usar Next.js?

### Setup e rotas
- [Criando projeto App Router](../rs-next-js/references/app-router-e-testes-criando-projeto-next-js-1.md) — setup
- [Layouts](../rs-next-js/references/app-router-e-testes-criando-layout-da-aplicacao.md) — estrutura
- [Rotas e layouts](../rs-next-js/references/roteamento-e-layouts-no-next-js.md) — routing
- [Grupos e rotas dinamicas](../rs-next-js/references/app-router-e-testes-grupos-e-rotas-dinamicas.md) — (group), [slug]
- [Parallel e intercepting routes](../rs-next-js/references/parallel-e-intercepting-routes.md) — modais
- [Pagina 404](../rs-next-js/references/criando-a-pagina-404-customizada.md) — not-found
- [Error boundary](../rs-next-js/references/criando-o-error.md) — error.tsx
- [Variaveis ambiente](../rs-next-js/references/app-router-e-testes-variaveis-ambiente-client-e-server.md) — NEXT_PUBLIC_

### Data fetching e rendering
- [SSR, SSG, ISR](../rs-next-js/references/ssr-ssg-e-isr.md) — conceitos
- [SSG e ISR na App Router](../rs-next-js/references/entendendo-ssg-e-isr-na-app-router.md) — pratica
- [Fetch em Server Components](../rs-next-js/references/app-router-e-testes-fetch-de-dados-nos-componentes.md) — data fetching
- [Cache e memoization](../rs-next-js/references/app-router-e-testes-cache-e-memoizacao.md) — otimizacao
- [Route handlers](../rs-next-js/references/app-router-e-testes-route-handlers-no-next.md) — API routes
- [Geracao estatica](../rs-next-js/references/app-router-e-testes-geracao-estatica-na-build.md) — generateStaticParams
- [Partial pre-rendering](../rs-next-js/references/partial-pre-rendering-suspense-api.md) — PPR
- [React Query](../rs-next-js/references/setup-do-react-query.md) — client-side fetching

### Server Components vs Client Components
- [React Server Components](../rs-next-js/references/app-router-e-testes-react-server-components.md) — conceito
- [Client boundaries](../rs-next-js/references/app-router-e-testes-client-boundaries-e-encadeamentop.md) — "use client"
- [Abstraindo client components](../rs-next-js/references/app-router-e-testes-abstraindo-client-components.md) — patterns
- [Suspense API](../rs-next-js/references/app-router-e-testes-suspense-api-no-react.md) — loading states
- [Loading skeleton](../rs-next-js/references/app-router-e-testes-loading-da-home.md) — loading.tsx
- [Streaming SSR](../rs-next-js/references/app-router-e-testes-loading-e-streaming-ssr.md) — progressive
- [Contexto no App Router](../rs-next-js/references/app-router-e-testes-contexto-do-carrinho.md) — providers

### Server Actions e formularios
- [O que sao Server Actions](../rs-next-js/references/o-que-sao-server-actions.md) — conceito
- [Criando Server Action](../rs-next-js/references/criando-a-server-action.md) — implementacao
- [Schema Zod + RHF](../rs-next-js/references/criando-o-schema-do-appointment-form.md) — validacao
- [Formulario de busca](../rs-next-js/references/app-router-e-testes-formulario-de-busca.md) — search
- [Interface otimista](../rs-next-js/references/funcionalidade-de-like.md) — optimistic UI
- [revalidatePath](../rs-next-js/references/utilizando-o-revalidate-path.md) — cache invalidation
- [Server Action edicao](../rs-next-js/references/criando-server-action-para-a-edicao.md) — update

### Paginas dinamicas
- [Pagina dinamica](../rs-next-js/references/criando-a-pagina-de-post.md) — [slug]/page.tsx
- [Busca com searchParams](../rs-next-js/references/busca-dinamica-1.md) — filtering
- [URL state com nuqs](../rs-next-js/references/search-parameters-com-nuqs.md) — URL-driven state
- [Modal intercepting](../rs-next-js/references/modal-do-detalhe-da-issue.md) — modal routes
- [Listagem dinamica](../rs-next-js/references/listagem-dinamica-de-posts.md) — lists

### UI components no Next.js
- [shadcn/ui](../rs-next-js/references/instalacao-shadcn-ui.md) — component library
- [Tailwind no Next.js](../rs-next-js/references/instalando-o-tailwind-css-v-3-1.md) — styling
- [Compound components](../rs-next-js/references/componentes-de-secao.md) — composicao
- [Header](../rs-next-js/references/app-router-e-testes-componente-header-7.md) — header component
- [ActiveLink](../rs-next-js/references/componente-active-link-1.md) — active nav
- [Link e Image](../rs-next-js/references/componentes-link-e-image.md) — next/link, next/image

### SEO e metadata
- [O que e SEO](../rs-next-js/references/o-que-e-seo.md) — conceitos
- [Metadata estatica](../rs-next-js/references/melhorando-o-seo-da-landing-page.md) — metadata export
- [generateMetadata](../rs-next-js/references/melhorando-o-seo-da-pagina-do-post.md) — metadata dinamica
- [OpenGraph image](../rs-next-js/references/app-router-e-testes-gerando-opengraph-image.md) — OG images
- [Core Web Vitals](../rs-next-js/references/seo-e-core-web-vitals.md) — performance

### Auth no Next.js
- [BetterAuth](../rs-next-js/references/autenticacao-com-better-auth.md) — auth library

---

## Como gerenciar estado?

### Context API (React built-in)
Quando escolher: estado simples, poucos consumers, sem performance issues
- [Context API](../rs-full-stack/references/0301-compreendendo-contexto-mkv-mp-4.md) — conceito
- [Context detalhado](../rs-full-stack/references/0302-contexto-em-detalhes-mkv-mp-4.md) — providers e consumers

### Redux Toolkit
Quando escolher: estado complexo, muitas actions, DevTools, time grande
- [Fundamentos Redux](../rs-redux-zustand/references/fundamentos-do-redux.md) — conceito
- [Criando store](../rs-redux-zustand/references/criando-store-do-redux.md) — configuracao
- [Criando reducer](../rs-redux-zustand/references/criando-reducer-do-player.md) — reducers
- [Dispatching actions](../rs-redux-zustand/references/disparando-actions-no-redux.md) — dispatch
- [Hook global seletor](../rs-redux-zustand/references/criando-hook-global.md) — useAppSelector
- [DevTools](../rs-redux-zustand/references/utilizando-redux-dev-tools.md) — debugging
- [Async thunks](../rs-redux-zustand/references/utilizando-async-thunks.md) — async operations
- [Loading state](../rs-redux-zustand/references/criando-interface-de-loading.md) — loading UI

### Zustand
Quando escolher: alternativa mais simples ao Redux, menos boilerplate, migracao
- [Setup Zustand](../rs-redux-zustand/references/setup-do-zustand.md) — configuracao
- [Migrando Redux para Zustand](../rs-redux-zustand/references/migrando-do-redux-p-zustand.md) — migracao

### URL State (nuqs)
Quando escolher: filtros, busca, estado sincronizado com URL
- [nuqs Next.js](../rs-next-js/references/search-parameters-com-nuqs.md) — URL-driven state
> Tambem usado em: [rs-testes-e](../rs-testes-e/references/adicionando-no-nuqs.md)

### State-driven UI patterns
- [Selecionando item atual](../rs-redux-zustand/references/selecionando-aula-atual.md) — selecao
- [Destacando item ativo](../rs-redux-zustand/references/destacando-aula-atual.md) — active state
- [Autoplay](../rs-redux-zustand/references/configurando-autoplay.md) — automatizacao

---

## Como construir frontend SaaS?

### UI patterns SaaS
- [Organization switcher](../rs-saa-s/references/componente-organization-switcher.md) — selector
- [Project switcher](../rs-saa-s/references/componente-project-switcher.md) — selector
- [Header](../rs-saa-s/references/componente-header-8.md) — SaaS header
- [Sheet behavior](../rs-saa-s/references/comportamento-do-sheet.md) — mobile drawer
- [Navegacao por abas](../rs-saa-s/references/navegacao-do-app-por-abas.md) — tab navigation
- [Temas dark/light](../rs-saa-s/references/temas-dark-light-com-next-themes.md) — theming

### Server Actions SaaS
- [Server Actions](../rs-saa-s/references/utilizando-server-actions.md) — pattern
- [useActionState](../rs-saa-s/references/usando-o-hook-use-action-state.md) — form state
- [Hook useFormState](../rs-saa-s/references/criando-hook-use-form-state.md) — custom hook
- [Estados de erro](../rs-saa-s/references/estados-de-erro-do-formulario.md) — error handling
- [Evitando reset](../rs-saa-s/references/evitando-reset-do-formulario.md) — form persistence

### Paginas SaaS
- [Pagina auth](../rs-saa-s/references/pagina-de-autenticacao.md) — login page
- [Pagina cadastro](../rs-saa-s/references/pagina-de-cadastro-1.md) — register page
- [Pagina criar org](../rs-saa-s/references/pagina-criar-organizacao.md) — create org
- [Pagina criar projeto](../rs-saa-s/references/pagina-criar-projeto.md) — create project
- [Pagina config org](../rs-saa-s/references/pagina-configuracoes-da-org.md) — org settings
- [Pagina aceitar convite](../rs-saa-s/references/pagina-aceitar-convite.md) — invite accept

### Rotas avancadas SaaS
- [Interception routes](../rs-saa-s/references/interception-routes-no-next-js.md) — modais
- [Parallel routes](../rs-saa-s/references/parallel-routes-no-next-js.md) — slots
- [Modal criacao projeto](../rs-saa-s/references/modal-de-criacao-de-projeto.md) — modal route

### RBAC na UI
- [Permissao no componente](../rs-saa-s/references/permissao-para-criar-projeto.md) — guards
- [Permissoes nas abas](../rs-saa-s/references/permissoes-nas-abas.md) — tab visibility
- [Obtendo permissoes](../rs-saa-s/references/obtendo-permissoes-do-usuario.md) — user abilities
- [Definindo permissoes](../rs-saa-s/references/definindo-permissoes-do-app.md) — app-level

### Login SaaS (frontend)
- [Login com cookies](../rs-saa-s/references/realizando-login-do-usuario.md) — auth flow
- [Auth via GitHub](../rs-saa-s/references/autenticacao-via-git-hub.md) — OAuth UI

---

## Como testar frontend?

### Unit tests (Jest + RTL)
- [Setup testes](../rs-testes-e/references/setup-testes.md) — Jest + RTL config
- [Primeiro teste componente](../rs-testes-e/references/criando-o-primeiro-teste-da-sidebar-content.md) — render + assert
- [Testando toggle](../rs-testes-e/references/testando-comportamentos-da-sidebar-content.md) — user events
- [Testando formularios](../rs-testes-e/references/testando-o-prompt-form.md) — form testing
- [Testando listas/cards](../rs-testes-e/references/testando-prompt-list-e-prompt-card.md) — lists
- [Matchers](../rs-testes-e/references/diferencas-entre-matchers-do-jest.md) — toBeVisible vs toBeInTheDocument
- [Responsividade](../rs-testes-e/references/criando-testes-unitarios-para-responsividade.md) — mobile tests

### Unit tests (use cases / actions)
- [Testando use cases](../rs-testes-e/references/testando-o-use-case.md) — fakes/spies
- [Testando Server Actions](../rs-testes-e/references/testando-a-server-action.md) — actions
- [Testando repository](../rs-testes-e/references/criando-os-testes-do-prisma-prompt-repository.md) — Prisma
- [Testando delete](../rs-testes-e/references/testando-o-sucesso-na-delecao.md) — success path

### E2E (Playwright)
- [Intro Playwright](../rs-testes-e/references/introducao-playwright.md) — conceito
- [Configurando](../rs-testes-e/references/configurando-o-playwright.md) — setup
- [Primeiro teste E2E](../rs-testes-e/references/criando-o-primeiro-teste-e-2-e.md) — navegacao
- [Fluxo criacao](../rs-testes-e/references/criando-teste-e-2-e-para-criacao-de-prompt.md) — create flow
- [Fluxo delecao](../rs-testes-e/references/criando-o-teste-e-2-e-de-delecao.md) — delete flow
- [Fluxo busca](../rs-testes-e/references/teste-e-2-e-para-busca-de-prompt.md) — search flow
- [Responsividade E2E](../rs-testes-e/references/criando-testes-e-2-e-para-responsividade.md) — viewport tests
- [TDD com E2E](../rs-testes-e/references/tdd-com-testes-e-2-e.md) — red-green-refactor

### E2E (Cypress — Next.js)
- [Cypress setup](../rs-next-js/references/app-router-e-testes-setup-do-cypress-e-2-e.md) — configuracao
- [CI com Cypress](../rs-next-js/references/app-router-e-testes-workflow-de-ci-com-cypress.md) — GitHub Actions

### Testes de state (Redux/Zustand)
- [Testes Redux](../rs-redux-zustand/references/criando-testes-unitarios.md) — reducers
- [Testes Zustand](../rs-redux-zustand/references/testes-unitarios-no-zustand.md) — stores

### Arquitetura no frontend
- [Arquitetura de software](../rs-testes-e/references/arquitetura-de-software.md) — conceito
- [RSC vs Client](../rs-testes-e/references/react-client-components-vs-react-server-components.md) — decisao
- [Separando regras](../rs-testes-e/references/separando-as-regras-de-negocio.md) — DIP frontend
- [CI pipeline](../rs-testes-e/references/criando-pipeline-de-ci.md) — automacao

---

## Como proteger o frontend?

### XSS e DOM
- [innerHTML alternativas](../rs-seguranca-para/references/devs-alternativas-a-innerhtml.md) — textContent
- [Clickjacking](../rs-seguranca-para/references/devs-click-jacking-em-iframe.md) — X-Frame-Options
- [CSS injection](../rs-seguranca-para/references/devs-css-sniffer.md) — CSS exfiltration
- [DOM clobbering](../rs-seguranca-para/references/devs-dom-clobbering-js.md) — prototype attacks
- [Iframe sandbox](../rs-seguranca-para/references/devs-iframe-atributo-sandbox.md) — sandboxing
- [SRI](../rs-seguranca-para/references/devs-subresource-integrity-sri.md) — integrity checks

### CSRF e headers
- [CSRF](../rs-seguranca-para/references/devs-cross-site-request-forgery-csrf.md) — protecao
- [CORS](../rs-seguranca-para/references/devs-headers-http-para-o-cors.md) — configuracao
- [Security headers](../rs-seguranca-para/references/devs-mais-alguns-headers-http.md) — CSP, HSTS

### Input e storage
- [Input validation](../rs-seguranca-para/references/devs-input-validation-e-falhas.md) — falhas comuns
- [Sanitizacao](../rs-seguranca-para/references/devs-validacao-de-entrada-e-sanitizacao.md) — limpeza
- [Local storage](../rs-seguranca-para/references/devs-local-storage-html.md) — riscos

---

## Como fazer deploy do frontend?

### Vercel (Next.js)
- [Deploy Vercel](../rs-next-js/references/fazendo-o-deploy-1.md) — deploy
- [Deploy frontend SaaS](../rs-saa-s/references/deploy-do-front-end.md) — Vercel SaaS

### GitHub Pages
- [GitHub Pages](../rs-full-stack/references/publicando-o-projeto.md) — deploy estatico

### Docker
- [Docker no Next.js](../rs-next-js/references/entendendo-o-que-e-o-docker.md) — containerizacao

### DevOps avancado (delegacao)
> Para Kubernetes, Terraform, CI/CD: [rs-devops](../rs-devops/SKILL.md)

---

## Decisoes transversais

### Como nomear e estruturar codigo?
- [Naming](../rs-clean-code/references/nomenclatura-de-variaveis-download-exercicio.md) — variaveis
- [Causa vs efeito](../rs-clean-code/references/causa-vs-efeito.md) — booleanos
- [Condicionais](../rs-clean-code/references/regras-em-condicionais.md) — early return
- [Parametros](../rs-clean-code/references/parametros-e-desestruturacao.md) — desestruturacao
- [Codigo em ingles](../rs-clean-code/references/codigo-em-ingles.md) — convencao

### TypeScript no frontend
- [O que e TypeScript](../rs-full-stack/references/o-que-e-o-type-script.md) — conceito
- [Tipos primitivos](../rs-full-stack/references/tipos-primitivos-2.md) — string, number, boolean
- [Type aliases](../rs-full-stack/references/type-3.md) — type keyword
- [Union types](../rs-full-stack/references/union-types.md) — unions
- [Partial](../rs-full-stack/references/partial.md) — utility type
- [Pick](../rs-full-stack/references/pick.md) — utility type
- [Omit](../rs-full-stack/references/omit.md) — utility type

---

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 1 (DDD)** → Componentes como entidades de dominio: [Clean Code React](#como-criar-componentes-react)
- **Fase 2 (Architecture)** → RSC vs Client, composicao, state management
- **Fase 3 (Implementacao)** → Siga o ramo relevante: HTML/CSS, React, Next.js, SaaS
- **Fase 4 (Validacao)** → Siga [Como testar?](#como-testar-frontend) + [Como proteger?](#como-proteger-o-frontend)

## Cross-References — Decision Coverage

Quando este router nao cobre uma decisao, delegue para:

| Decisao | Delegue para | Motivo |
|---------|-------------|--------|
| Backend API | [rs-backend-decisions](../rs-backend-decisions/SKILL.md) | Fastify, NestJS, Prisma, auth |
| Node.js runtime | [rs-node-js](../rs-node-js/SKILL.md) | Streams, DDD, repositories |
| Bun/Elysia API | [rs-api-com](../rs-api-com/SKILL.md) | Bun, Drizzle ORM |
| DevOps avancado | [rs-devops](../rs-devops/SKILL.md) | K8s, Terraform, CI/CD |
| IA com Node.js | [rs-ia-node](../rs-ia-node/SKILL.md) | LLMs, embeddings |
| Seguranca backend | [rs-seguranca-para](../rs-seguranca-para/SKILL.md) | Injection, secrets, TLS |
| SOLID/DDD profundo | [rs-clean-code](../rs-clean-code/SKILL.md) | Arquitetura de dominio |
