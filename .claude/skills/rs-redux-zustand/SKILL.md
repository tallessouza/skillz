---
name: rs-redux-zustand
description: "Enforces Redux and Zustand state management best practices when configuring stores, writing reducers, dispatching actions, creating async thunks, migrating from Redux to Zustand, or testing state logic. Make sure to use this skill whenever implementing global state with Redux Toolkit or Zustand, building player/course UIs with state-driven components, or setting up DevTools for debugging. Not for backend logic, database operations, or non-React state management."
---

# Redux & Zustand — Decision Tree Router

> Siga a árvore de decisão para chegar na skill certa. 22 skills organizadas em 6 domínios.

## Decision Tree

```
O que você está fazendo com state management?
│
├─ Redux setup / store?
│  ├─ Fundamentos Redux → [fundamentos-do-redux.md](references/fundamentos-do-redux.md)
│  ├─ Criando store → [criando-store-do-redux.md](references/criando-store-do-redux.md)
│  ├─ Criando reducer → [criando-reducer-do-player.md](references/criando-reducer-do-player.md)
│  ├─ Dispatching actions → [disparando-actions-no-redux.md](references/disparando-actions-no-redux.md)
│  ├─ Hook global seletor → [criando-hook-global.md](references/criando-hook-global.md)
│  └─ DevTools → [utilizando-redux-dev-tools.md](references/utilizando-redux-dev-tools.md)
│
├─ Async / API?
│  ├─ Carregando dados → [carregando-dados-do-curso.md](references/carregando-dados-do-curso.md)
│  ├─ Async thunks → [utilizando-async-thunks.md](references/utilizando-async-thunks.md)
│  ├─ Loading state → [criando-interface-de-loading.md](references/criando-interface-de-loading.md)
│  └─ JSON Server → [criando-api-de-cursos-json-server.md](references/criando-api-de-cursos-json-server.md)
│
├─ UI components?
│  ├─ Estrutura base → [estrutura-base-da-ui.md](references/estrutura-base-da-ui.md)
│  ├─ Módulos e player → [ui-dos-modulos-e-player.md](references/ui-dos-modulos-e-player.md)
│  ├─ Radix Collapsible → [radix-collapsible-nos-modulos.md](references/radix-collapsible-nos-modulos.md)
│  ├─ Scrollbar sidebar → [scrollbar-na-sidebar.md](references/scrollbar-na-sidebar.md)
│  └─ Separando componentes → [separando-componentes-2.md](references/separando-componentes-2.md)
│
├─ Interações state-driven?
│  ├─ Selecionando item atual → [selecionando-aula-atual.md](references/selecionando-aula-atual.md)
│  ├─ Destacando item ativo → [destacando-aula-atual.md](references/destacando-aula-atual.md)
│  └─ Autoplay → [configurando-autoplay.md](references/configurando-autoplay.md)
│
├─ Zustand?
│  ├─ Setup Zustand → [setup-do-zustand.md](references/setup-do-zustand.md)
│  └─ Migrando Redux → Zustand → [migrando-do-redux-p-zustand.md](references/migrando-do-redux-p-zustand.md)
│
└─ Testes?
   ├─ Testes unitários Redux → [criando-testes-unitarios.md](references/criando-testes-unitarios.md)
   └─ Testes Zustand → [testes-unitarios-no-zustand.md](references/testes-unitarios-no-zustand.md)
```

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 3 (Implementação)** → Siga o ramo relevante por feature de state

## Cross-References — Decision Coverage

Quando este router nao cobre uma decisao, delegue para:

| Decisao | Delegue para | Motivo |
|---------|-------------|--------|
| D1_FRAMEWORK_WEB (Next.js) | [rs-next-js](../rs-next-js/SKILL.md) | Next.js / React profundo |
| D3_STYLING (Tailwind) | [rs-masterizando](../rs-masterizando/SKILL.md) | Tailwind CSS |
| D3_TESTING (testes) | [rs-testes-e](../rs-testes-e/SKILL.md) | Testes profundos |
| D3_AUTH (JWT/OAuth) | [rs-seguranca-para](../rs-seguranca-para/SKILL.md) | Auth |
