---
name: rs-redux-zustand-criando-store-do-redux
description: "Applies Redux Toolkit store setup patterns when creating or configuring global state in React applications. Use when user asks to 'setup Redux', 'create a store', 'configure Redux Toolkit', 'add global state with Redux', or 'install reduxjs toolkit'. Covers configureStore, createSlice, Provider wrapping, and useSelector usage. Make sure to use this skill whenever scaffolding Redux in a React project or adding new slices to an existing store. Not for Zustand setup (use setup-do-zustand), Context API alone, or server-side state management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: criando-store
  tags: [redux-toolkit, configureStore, createSlice, provider, useSelector, react]
---

# Criando Store do Redux com Redux Toolkit

> Configure estado global com Redux Toolkit usando configureStore, createSlice, Provider e useSelector.

## Rules

1. **Use Redux Toolkit, nunca Redux puro** — `@reduxjs/toolkit` substitui o setup manual, porque simplifica boilerplate e e a recomendacao oficial
2. **Organize estado em Slices** — cada dominio vira um slice via `createSlice`, porque evita reducer monolitico
3. **Store em `src/store/index.ts`** — ponto unico com `configureStore`, porque centraliza todos os reducers
4. **Provider no main.tsx** — envolva `<App />` com Provider do `react-redux`, porque sem isso nenhum componente acessa o estado
5. **useSelector para leitura seletiva** — selecione apenas o slice necessario (`state.todo`), nunca o store inteiro, porque causa re-renders desnecessarios
6. **Instale ambos os pacotes** — `@reduxjs/toolkit` + `react-redux`, porque o Toolkit e agnostico de UI

## How to write

### Store + Slice + Provider

```typescript
// src/store/index.ts
import { configureStore, createSlice } from '@reduxjs/toolkit'
const todoSlice = createSlice({ name: 'todo', initialState: ['Fazer cafe'], reducers: {} })
export const store = configureStore({ reducer: { todo: todoSlice.reducer } })
export type RootState = ReturnType<typeof store.getState>

// main.tsx
import { Provider as ReduxProvider } from 'react-redux'
<ReduxProvider store={store}><App /></ReduxProvider>

// Component
const todos = useSelector((state: RootState) => state.todo)
```

## Example

**Before (componentes isolados):**
```typescript
export function TodoList() { return <ul><li>Fazer cafe</li></ul> }
```

**After (com Redux Toolkit):**
```typescript
const todos = useSelector((state: RootState) => state.todo)
return <ul>{todos.map(t => <li key={t}>{t}</li>)}</ul>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo com estado global | `npm i @reduxjs/toolkit react-redux` |
| Multiplos dominios | Um slice por dominio, todos no configureStore |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `import { createStore } from 'redux'` | `import { configureStore } from '@reduxjs/toolkit'` |
| Retornar store inteiro no useSelector | Selecionar apenas o slice: `state.todo` |
| Esquecer de instalar react-redux | Instalar ambos |

## Troubleshooting

### useSelector retorna undefined
**Symptom:** Componente renderiza sem dados apesar do slice ter initialState.
**Cause:** Provider nao esta envolvendo a aplicacao, ou a chave no configureStore nao bate.
**Fix:** Verifique `<ReduxProvider store={store}>` envolvendo `<App />` e que `state.todo` corresponde a chave `todo` em `reducer: { todo }`.

### TypeScript reclama de tipo unknown
**Symptom:** `state` no selector e `unknown`.
**Cause:** `useSelector` padrao nao conhece o formato do store.
**Fix:** Crie `type RootState = ReturnType<typeof store.getState>` e use como type annotation.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-criando-store-do-redux/references/deep-explanation.md) — Por que Redux Toolkit, conceito de Slices, Redux e agnostico de UI
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-criando-store-do-redux/references/code-examples.md) — Instalacao, store, Provider, useSelector, multiplos slices
