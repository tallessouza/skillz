---
name: rs-testes-e-overview-do-projeto-6
description: "Guides frontend project architecture decisions combining Next.js with Clean Architecture, SOLID, testing pyramid, and design patterns. Use when user asks to 'setup a Next.js project', 'structure a frontend app', 'add tests to frontend', 'apply clean architecture in React', or 'organize a React project with SOLID'. Make sure to use this skill whenever starting a new frontend project that needs architectural rigor beyond simple CRUD. Not for backend-only architecture, infrastructure setup, or CI/CD configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: fundamentos
  tags: [testing, next-js, react, ci]
---

# Overview: Testes e Arquitetura no Frontend

> Um projeto frontend simples escolhido a dedo permite focar no que importa: testes, Clean Architecture, SOLID e design patterns aplicados ao React/Next.js.

## Key concept

Projetos simples em escopo sao os melhores veiculos para aprender arquitetura porque eliminam a complexidade acidental do dominio. O valor nao esta na aplicacao (um gerenciador de prompts), mas nas praticas aplicadas: piramide de testes, Clean Architecture adaptada ao frontend, principios SOLID com ajustes para React, e design patterns como Repository e Composition.

## Stack de referencia

| Camada | Tecnologia | Proposito |
|--------|-----------|-----------|
| Framework | Next.js (App Router) | React Server Components + Client Components |
| Formularios | React Hook Form + Zod | Validacao tipada de formularios |
| Animacoes | Motion (ex-Framer Motion) | Micro animacoes de UI |
| Testes unitarios/integracao | Vitest/Jest | Base da piramide |
| Testes e2e | Playwright/Cypress | Topo da piramide |

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Novo projeto frontend com dominio simples | Focar em arquitetura e testes, nao em features |
| React Server Components vs Client Components | Server por padrao, Client apenas para interatividade (forms, animacoes) |
| Validacao de formulario | React Hook Form + Zod — mesmo formularios simples se beneficiam |
| Estrutura de testes | Piramide: muitos unitarios, alguns integracao, poucos e2e |
| Logica de negocio no frontend | Clean Architecture adaptada — separar dominio de framework |
| Codigo reutilizavel entre componentes | Design patterns: Repository, Composition |
| TDD no frontend | Aplicar quando faz sentido — diferente do backend |

## Piramide de testes no frontend

```
        /  E2E  \        ← Poucos, frageis, alto valor de confianca
       /----------\
      / Integracao  \    ← Alguns, testam composicao de unidades
     /----------------\
    /    Unitarios      \ ← Muitos, rapidos, base solida
```

**Testes e2e sao mais frageis** por questao de mudanca na UI, mas tem valor extremamente importante para validar fluxos completos.

## Conceitos arquiteturais aplicados

| Conceito | Origem | Adaptacao frontend |
|----------|--------|--------------------|
| Clean Architecture | Robert C. Martin | Separar camadas mesmo em React — adaptar, nao copiar 1:1 |
| SOLID | Robert C. Martin | Alguns principios precisam adaptacao para componentes React |
| Repository Pattern | Martin Fowler (PoEAA, 2003) | Abstrair acesso a dados (API calls) do restante da app |
| Composition Pattern | React ecosystem | Compor comportamento via componentes, nao heranca |

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Clean Arch nao se aplica ao frontend | Aplica-se com adaptacoes — separar dominio de infraestrutura |
| SOLID e so pra backend/OOP | Varios principios (SRP, DIP, OCP) se aplicam a componentes React |
| Projeto simples nao precisa de arquitetura | Projeto simples e o melhor para APRENDER arquitetura sem ruido |
| TDD no frontend funciona igual ao backend | E diferente — nem sempre faz sentido, mas em certos casos sim |
| Testes e2e substituem unitarios | Complementam — e2e sao frageis, unitarios sao a base |

## When to apply

- Ao iniciar qualquer projeto Next.js que ira crescer alem de um prototipo
- Ao estruturar testes em uma aplicacao React existente
- Ao decidir onde colocar logica de negocio no frontend (componente vs camada de dominio)
- Ao escolher entre testar unitariamente ou com e2e

## Limitations

- Clean Architecture no frontend exige adaptacoes — nao copiar patterns de backend diretamente
- Testes e2e sao inerentemente frageis a mudancas de UI
- Over-engineering em projetos que realmente sao descartaveis desperdiça tempo
- SOLID em componentes React nem sempre mapeia 1:1 com as definicoes originais de OOP


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
