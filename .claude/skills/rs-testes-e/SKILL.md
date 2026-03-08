---
name: rs-testes-e
description: "Enforces frontend testing and clean architecture best practices when writing unit tests with Jest and React Testing Library, creating E2E tests with Playwright, implementing Server Actions with TDD, structuring use cases with dependency inversion, testing React components and forms, or setting up CI pipelines. Make sure to use this skill whenever testing Next.js components, writing Playwright E2E flows, implementing Server Actions, configuring Jest/RTL, building test doubles (fakes/spies/mocks), or validating responsive layouts. Not for backend-only testing, API load testing, or non-React frontend frameworks."
---

# Testes e Arquitetura Frontend — Decision Tree Router

> Siga a arvore de decisao para chegar na skill certa. 74 skills organizadas por pergunta natural do desenvolvedor.

## Tracer Bullet — Caminho Rapido

| Preciso... | Skill |
|------------|-------|
| Configurar Jest + RTL do zero | [setup-testes](references/setup-testes.md) |
| Escrever meu primeiro teste unitario | [testando-componente-logo](references/testando-componente-logo.md) |
| Configurar Playwright | [configurando-o-playwright](references/configurando-o-playwright.md) |
| Escrever meu primeiro E2E | [criando-o-primeiro-teste-e-2-e](references/criando-o-primeiro-teste-e-2-e.md) |
| Testar Server Action | [testando-a-server-action](references/testando-a-server-action.md) |
| Testar use case com mock | [testando-o-use-case](references/testando-o-use-case.md) |
| Criar pipeline CI | [criando-pipeline-de-ci](references/criando-pipeline-de-ci.md) |

---

## Decision Tree

### 1. Estou comecando o projeto?

> Setup, arquitetura, fundamentos e design system.

#### 1.1 Qual fase do setup?

- [overview-do-projeto-6](references/overview-do-projeto-6.md) — visao geral do projeto, stack e objetivos
- [teste-e-qualidade](references/teste-e-qualidade.md) — principios de qualidade, piramide de testes, AAA pattern
- [arquitetura-de-software](references/arquitetura-de-software.md) — clean architecture e SOLID no frontend
- [react-client-components-vs-react-server-components](references/react-client-components-vs-react-server-components.md) — quando usar RSC vs Client Components
- [iniciando-com-o-next-js](references/iniciando-com-o-next-js.md) — criando projeto Next.js com App Router
- [setup-docker-docker-compose-e-prisma](references/setup-docker-docker-compose-e-prisma.md) — Docker + Prisma para banco local
- [criando-o-seed-e-migrando-para-o-prisma-v-7](references/criando-o-seed-e-migrando-para-o-prisma-v-7.md) — seed de dados e migracao Prisma v7
- [setup-design-system](references/setup-design-system.md) — setup shadcn/ui no Next.js
- [estilos-e-fontes-do-design-system](references/estilos-e-fontes-do-design-system.md) — fontes e estilos do design system
- [eslint-prettier-e-lefthook](references/eslint-prettier-e-lefthook.md) — linting, formatacao e git hooks
- [setup-testes](references/setup-testes.md) — configurando Jest + React Testing Library

### 2. Estou construindo componentes/paginas?

> Implementacao de UI antes de testar.

#### 2.1 Qual componente ou pagina?

- [criando-a-home-page-3](references/criando-a-home-page-3.md) — home page com layout sidebar-ready
- [iniciando-a-sidebar](references/iniciando-a-sidebar.md) — estrutura da sidebar com toggle
- [criando-o-prompt-list-e-prompt-card](references/criando-o-prompt-list-e-prompt-card.md) — lista e card de prompts
- [finalizando-a-lista-de-prompts](references/finalizando-a-lista-de-prompts.md) — finalizando a listagem de prompts
- [criando-o-copy-button](references/criando-o-copy-button.md) — botao de copiar com clipboard API
- [criando-botao-de-delecao](references/criando-botao-de-delecao.md) — botao de deletar com confirmacao
- [criando-a-pagina-de-novo-prompt](references/criando-a-pagina-de-novo-prompt.md) — pagina de criacao de prompt
- [construindo-a-tela-de-edicao](references/construindo-a-tela-de-edicao.md) — tela de edicao com dynamic routes
- [implementando-responsividade](references/implementando-responsividade.md) — layout responsivo com Tailwind

#### 2.2 Formularios e validacao?

- [detalhe-do-react-hook-form](references/detalhe-do-react-hook-form.md) — React Hook Form com Zod resolver
- [incrementando-o-formulario-de-criacao](references/incrementando-o-formulario-de-criacao.md) — Zod + React Hook Form no formulario
- [melhorando-o-feedback-para-o-usuario](references/melhorando-o-feedback-para-o-usuario.md) — feedback de validacao com FormMessage
- [adicionando-o-toast](references/adicionando-o-toast.md) — toast feedback com Sonner

#### 2.3 Busca e filtragem?

- [iniciando-a-busca-de-prompts](references/iniciando-a-busca-de-prompts.md) — iniciando funcionalidade de busca
- [implementando-a-barra-de-pesquisa](references/implementando-a-barra-de-pesquisa.md) — componente SearchInput
- [implementando-a-renderizacao-da-lista](references/implementando-a-renderizacao-da-lista.md) — renderizacao filtrada da lista
- [salvando-a-busca-na-url](references/salvando-a-busca-na-url.md) — persistindo query na URL
- [atualizar-search-input-com-a-url](references/atualizar-search-input-com-a-url.md) — sincronizando input com URL state
- [adicionando-no-nuqs](references/adicionando-no-nuqs.md) — URL state management com nuqs

### 3. Estou escrevendo logica de negocio?

> Use cases, Server Actions, regras de negocio.

#### 3.1 Use cases (clean architecture)?

- [separando-as-regras-de-negocio](references/separando-as-regras-de-negocio.md) — extraindo regras de negocio em use cases
- [criando-o-delete-prompt-use-case](references/criando-o-delete-prompt-use-case.md) — delete use case com repository pattern
- [configurando-o-playwright](references/configurando-o-playwright.md) — _(ver E2E abaixo)_

#### 3.2 Server Actions?

- [criando-a-create-prompt-action](references/criando-a-create-prompt-action.md) — Server Action de criacao com TDD
- [criando-a-delete-prompt-action](references/criando-a-delete-prompt-action.md) — Server Action de delecao
- [integrando-a-server-action-com-o-formulario](references/integrando-a-server-action-com-o-formulario.md) — integrando action com form (create)
- [integrando-server-action-ao-formulario](references/integrando-server-action-ao-formulario.md) — integrando action com form (update)
- [adicionando-o-revalidate-path](references/adicionando-o-revalidate-path.md) — revalidatePath apos mutacoes
- [server-actions-em-ambientes-de-teste](references/server-actions-em-ambientes-de-teste.md) — Server Actions com Suspense em testes

### 4. Estou escrevendo testes unitarios?

> Jest, React Testing Library, mocks, spies, fakes.

#### 4.1 Testando componentes de UI?

- [testando-componente-logo](references/testando-componente-logo.md) — primeiro teste: visibilidade, getByRole, links
- [criando-o-primeiro-teste-da-sidebar-content](references/criando-o-primeiro-teste-da-sidebar-content.md) — primeiro teste de sidebar
- [testando-comportamentos-da-sidebar-content](references/testando-comportamentos-da-sidebar-content.md) — toggle collapse/expand
- [finalizando-sidebar-e-incrementando-os-testes](references/finalizando-sidebar-e-incrementando-os-testes.md) — finalizando sidebar + testes incrementais
- [testando-o-copy-button](references/testando-o-copy-button.md) — testando clipboard API no botao copiar
- [testando-prompt-list-e-prompt-card](references/testando-prompt-list-e-prompt-card.md) — testando lista e cards
- [cobrindo-cenarios-no-prompt-card](references/cobrindo-cenarios-no-prompt-card.md) — cenarios adicionais do PromptCard
- [testando-comportamento-de-criar-novo-prompt](references/testando-comportamento-de-criar-novo-prompt.md) — testando fluxo de criacao

#### 4.2 Testando formularios?

- [testando-o-prompt-form](references/testando-o-prompt-form.md) — testando formularios com React Hook Form
- [melhorando-os-testes-do-prompt-form](references/melhorando-os-testes-do-prompt-form.md) — melhorando cobertura do form

#### 4.3 Testando responsividade (unitario)?

- [criando-testes-unitarios-para-responsividade](references/criando-testes-unitarios-para-responsividade.md) — media queries em testes unitarios

#### 4.4 Testando use cases?

- [testando-o-use-case](references/testando-o-use-case.md) — use case com fakes/spies e dependency inversion
- [testando-create-prompt-use-case](references/testando-create-prompt-use-case.md) — testando create use case com mock factories
- [testando-o-use-case-de-update](references/testando-o-use-case-de-update.md) — testando update use case (happy + error paths)

#### 4.5 Testando Server Actions?

- [testando-a-server-action](references/testando-a-server-action.md) — testando actions com mocks de use case
- [criando-testes-unitarios-da-action-de-delecao](references/criando-testes-unitarios-da-action-de-delecao.md) — testando delete action
- [testando-a-action-de-update](references/testando-a-action-de-update.md) — testando update action com Zod e cenarios de erro
- [testando-o-sucesso-na-delecao](references/testando-o-sucesso-na-delecao.md) — testando sucesso na delecao

#### 4.6 Testando repositorios (Prisma)?

- [criando-os-testes-do-prisma-prompt-repository](references/criando-os-testes-do-prisma-prompt-repository.md) — testes de repository Prisma
- [adicionar-mais-testes-ao-prisma-prompt-repository](references/adicionar-mais-testes-ao-prisma-prompt-repository.md) — expandindo cobertura do repository

#### 4.7 Matchers e tecnicas de teste?

- [diferencas-entre-matchers-do-jest](references/diferencas-entre-matchers-do-jest.md) — toBeVisible vs toBeInTheDocument e outros matchers
- [corrigindo-os-testes-com-polyfill](references/corrigindo-os-testes-com-polyfill.md) — polyfills para JSDOM (TextEncoder, structuredClone)

### 5. Estou escrevendo testes E2E?

> Playwright: setup, fluxos, selectors, responsividade.

#### 5.1 Preciso de introducao/setup?

- [introducao-playwright](references/introducao-playwright.md) — o que e Playwright e quando usar
- [configurando-o-playwright](references/configurando-o-playwright.md) — configuracao do Playwright no projeto

#### 5.2 Qual fluxo E2E?

- [criando-o-primeiro-teste-e-2-e](references/criando-o-primeiro-teste-e-2-e.md) — primeiro teste E2E (navegacao basica)
- [criando-teste-e-2-e-para-criacao-de-prompt](references/criando-teste-e-2-e-para-criacao-de-prompt.md) — E2E fluxo de criacao
- [criando-o-teste-e-2-e-de-delecao](references/criando-o-teste-e-2-e-de-delecao.md) — E2E fluxo de delecao
- [teste-e-2-e-para-busca-de-prompt](references/teste-e-2-e-para-busca-de-prompt.md) — E2E fluxo de busca
- [testando-com-e-2-e-duplicidade](references/testando-com-e-2-e-duplicidade.md) — E2E validacao de duplicidade com seed

#### 5.3 E2E com TDD?

- [tdd-com-testes-e-2-e](references/tdd-com-testes-e-2-e.md) — TDD guiado por testes E2E

#### 5.4 E2E responsividade?

- [criando-testes-e-2-e-para-responsividade](references/criando-testes-e-2-e-para-responsividade.md) — E2E em diferentes viewports

#### 5.5 E2E com animacoes?

- [adicionar-animacoes-e-corrigindo-teste-e-2-e](references/adicionar-animacoes-e-corrigindo-teste-e-2-e.md) — Motion animations + fix E2E state desync

### 6. Estou configurando CI/CD ou deploy?

> Pipeline, integracoes, deploy, vulnerabilidades.

- [o-que-e-ci](references/o-que-e-ci.md) — conceitos de CI/CD, distincao CI vs CD
- [criando-pipeline-de-ci](references/criando-pipeline-de-ci.md) — GitHub Actions pipeline com testes
- [fazendo-o-deploy-2](references/fazendo-o-deploy-2.md) — deploy Next.js + Prisma na Vercel
- [dicas-e-fechamento](references/dicas-e-fechamento.md) — monitoramento de vulnerabilidades (Snyk, GitHub Advisory)

---

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 4 (Validacao)** → Siga o ramo relevante por tipo de teste (secos 4 e 5)
- **Fase 1 (Arquitetura)** → Consulte secao 1 para setup e fundamentos
- **Fase 3 (Implementacao)** → Consulte secao 2-3 para componentes e logica

## Cross-References

| Decisao | Delegue para | Motivo |
|---------|-------------|--------|
| Testes backend Node.js (Vitest, supertest) | [rs-node-js](../rs-node-js/SKILL.md) | Testes de API, Fastify, NestJS |
| Testes Next.js App Router (SSR, API routes) | [rs-next-js](../rs-next-js/SKILL.md) | Server Components, routing, middleware |
| Codigo testavel (SOLID, DDD, naming) | [rs-clean-code](../rs-clean-code/SKILL.md) | Principios de codigo limpo |
| Docker/CI profundo | [rs-devops](../rs-devops/SKILL.md) | Docker, K8s, Terraform, GitHub Actions avancado |
| Seguranca (XSS, CSRF, injection) | [rs-seguranca-para](../rs-seguranca-para/SKILL.md) | Auth + seguranca web |
