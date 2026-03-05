---
name: rs-testes-e
description: "Enforces frontend testing and clean architecture best practices when writing unit tests with Jest and React Testing Library, creating E2E tests with Playwright, implementing Server Actions with TDD, structuring use cases with dependency inversion, testing React components and forms, or setting up CI pipelines. Make sure to use this skill whenever testing Next.js components, writing Playwright E2E flows, implementing Server Actions, configuring Jest/RTL, building test doubles (fakes/spies/mocks), or validating responsive layouts. Not for backend-only testing, API load testing, or non-React frontend frameworks."
---

# Testes e Arquitetura Frontend — Decision Tree Router

> Siga a árvore de decisão para chegar na skill certa. 74 skills organizadas em 7 domínios.

## Decision Tree

```
O que você está fazendo com testes?
│
├─ Setup de projeto / infraestrutura?
│  ├─ Setup Next.js + Prisma → [arquitetura-no-frontend-iniciando-com-o-next-js.md](references/arquitetura-no-frontend-iniciando-com-o-next-js.md)
│  ├─ Setup testes (Jest + RTL) → [arquitetura-no-frontend-setup-testes.md](references/arquitetura-no-frontend-setup-testes.md)
│  ├─ Docker + Prisma → [arquitetura-no-frontend-setup-docker-docker-compose-e-prisma.md](references/arquitetura-no-frontend-setup-docker-docker-compose-e-prisma.md)
│  ├─ ESLint + Prettier + Lefthook → [arquitetura-no-frontend-eslint-prettier-e-lefthook.md](references/arquitetura-no-frontend-eslint-prettier-e-lefthook.md)
│  └─ CI pipeline → [arquitetura-no-frontend-criando-pipeline-de-ci.md](references/arquitetura-no-frontend-criando-pipeline-de-ci.md)
│
├─ Arquitetura / clean code no frontend?
│  ├─ Arquitetura de software → [arquitetura-no-frontend-arquitetura-de-software.md](references/arquitetura-no-frontend-arquitetura-de-software.md)
│  ├─ RSC vs Client Components → [arquitetura-no-frontend-react-client-components-vs-react-server-components.md](references/arquitetura-no-frontend-react-client-components-vs-react-server-components.md)
│  └─ Separando regras de negócio → [arquitetura-no-frontend-separando-as-regras-de-negocio.md](references/arquitetura-no-frontend-separando-as-regras-de-negocio.md)
│
├─ Server Actions / use cases?
│  ├─ Server Action com TDD → [arquitetura-no-frontend-criando-a-create-prompt-action.md](references/arquitetura-no-frontend-criando-a-create-prompt-action.md)
│  ├─ Delete action → [arquitetura-no-frontend-criando-a-delete-prompt-action.md](references/arquitetura-no-frontend-criando-a-delete-prompt-action.md)
│  ├─ Zod + React Hook Form → [arquitetura-no-frontend-incrementando-o-formulario-de-criacao.md](references/arquitetura-no-frontend-incrementando-o-formulario-de-criacao.md)
│  ├─ Integrando form + action → [arquitetura-no-frontend-integrando-a-server-action-com-o-formulario.md](references/arquitetura-no-frontend-integrando-a-server-action-com-o-formulario.md)
│  └─ URL state (nuqs) → [arquitetura-no-frontend-adicionando-no-nuqs.md](references/arquitetura-no-frontend-adicionando-no-nuqs.md)
│
├─ Testes unitários de componentes?
│  ├─ Primeiro teste componente → [arquitetura-no-frontend-criando-o-primeiro-teste-da-sidebar-content.md](references/arquitetura-no-frontend-criando-o-primeiro-teste-da-sidebar-content.md)
│  ├─ Testando toggle (collapse/expand) → [arquitetura-no-frontend-testando-comportamentos-da-sidebar-content.md](references/arquitetura-no-frontend-testando-comportamentos-da-sidebar-content.md)
│  ├─ Testando formulários → [arquitetura-no-frontend-testando-o-prompt-form.md](references/arquitetura-no-frontend-testando-o-prompt-form.md)
│  ├─ Testando listas/cards → [arquitetura-no-frontend-testando-prompt-list-e-prompt-card.md](references/arquitetura-no-frontend-testando-prompt-list-e-prompt-card.md)
│  ├─ Matchers (toBeVisible vs toBeInTheDocument) → [arquitetura-no-frontend-diferencas-entre-matchers-do-jest.md](references/arquitetura-no-frontend-diferencas-entre-matchers-do-jest.md)
│  └─ Responsividade → [arquitetura-no-frontend-criando-testes-unitarios-para-responsividade.md](references/arquitetura-no-frontend-criando-testes-unitarios-para-responsividade.md)
│
├─ Testes unitários de actions / use cases / repos?
│  ├─ Testando use cases (fakes/spies) → [arquitetura-no-frontend-testando-o-use-case.md](references/arquitetura-no-frontend-testando-o-use-case.md)
│  ├─ Testando Server Actions → [arquitetura-no-frontend-testando-a-server-action.md](references/arquitetura-no-frontend-testando-a-server-action.md)
│  ├─ Testando Prisma repository → [arquitetura-no-frontend-criando-os-testes-do-prisma-prompt-repository.md](references/arquitetura-no-frontend-criando-os-testes-do-prisma-prompt-repository.md)
│  └─ Testando delete success → [arquitetura-no-frontend-testando-o-sucesso-na-delecao.md](references/arquitetura-no-frontend-testando-o-sucesso-na-delecao.md)
│
└─ E2E com Playwright?
   ├─ Intro Playwright → [arquitetura-no-frontend-introducao-playwright.md](references/arquitetura-no-frontend-introducao-playwright.md)
   ├─ Configurando → [arquitetura-no-frontend-configurando-o-playwright.md](references/arquitetura-no-frontend-configurando-o-playwright.md)
   ├─ Primeiro teste E2E → [arquitetura-no-frontend-criando-o-primeiro-teste-e-2-e.md](references/arquitetura-no-frontend-criando-o-primeiro-teste-e-2-e.md)
   ├─ Fluxo de criação → [arquitetura-no-frontend-criando-teste-e-2-e-para-criacao-de-prompt.md](references/arquitetura-no-frontend-criando-teste-e-2-e-para-criacao-de-prompt.md)
   ├─ Deleção → [arquitetura-no-frontend-criando-o-teste-e-2-e-de-delecao.md](references/arquitetura-no-frontend-criando-o-teste-e-2-e-de-delecao.md)
   ├─ Busca → [arquitetura-no-frontend-teste-e-2-e-para-busca-de-prompt.md](references/arquitetura-no-frontend-teste-e-2-e-para-busca-de-prompt.md)
   ├─ Responsividade → [arquitetura-no-frontend-criando-testes-e-2-e-para-responsividade.md](references/arquitetura-no-frontend-criando-testes-e-2-e-para-responsividade.md)
   └─ TDD com E2E → [arquitetura-no-frontend-tdd-com-testes-e-2-e.md](references/arquitetura-no-frontend-tdd-com-testes-e-2-e.md)
```

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 4 (Validação)** → Siga o ramo relevante por tipo de teste
