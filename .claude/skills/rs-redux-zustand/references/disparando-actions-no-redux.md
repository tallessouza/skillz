---
name: rs-redux-zustand-disparando-actions-no-redux
description: "Applies Redux dispatch patterns and typed selectors when writing React components that modify global state. Use when user asks to 'dispatch an action', 'update Redux state', 'create a reducer action', 'add useDispatch', 'type Redux selectors', or 'export actions from slice'. Enforces TypedUseSelectorHook, action export, and PayloadAction structure. Make sure to use this skill whenever implementing state mutations with Redux Toolkit. Not for Zustand state updates, React Context, or local useState."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: disparando-actions
  tags: [redux, dispatch, actions, useDispatch, TypedUseSelectorHook, PayloadAction]
---

# Disparando Actions no Redux

> Toda alteracao de estado passa por actions tipadas, exportadas do slice e disparadas via useDispatch.

## Rules

1. **Defina actions dentro de `reducers`** — centraliza mutacoes e garante rastreabilidade
2. **Exporte actions de `slice.actions`** — `export const { add } = todoSlice.actions`
3. **useDispatch para disparar** — nunca mute estado diretamente
4. **Tipe selector com `TypedUseSelectorHook`** — `useAppSelector` tipado com `RootState`
5. **Derive RootState com `ReturnType<typeof store.getState>`** — se atualiza automaticamente
6. **Payload estruturado** — envie objetos: `dispatch(add({ newTodo: 'texto' }))`

## How to write

```typescript
// store.ts
export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// slice
export const { add } = todoSlice.actions

// componente
dispatch(add({ newTodo: 'Estudar React' }))
```

## Example

**Before:** `dispatch(add('texto'))` — sem tipagem, payload solto
**After:** `dispatch(add({ newTodo: 'texto' }))` — payload estruturado, selector tipado

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `state = newValue` (reatribuicao) | `state.push(item)` (mutacao via Immer) |
| `useSelector` sem tipagem | `useAppSelector` com RootState |

## Troubleshooting

### `typeof store.getState` retorna funcao
**Symptom:** RootState e `() => { todo: string[] }` em vez de `{ todo: string[] }`.
**Cause:** Faltou `ReturnType<>`.
**Fix:** Use `ReturnType<typeof store.getState>`.

### Console.log no reducer mostra Proxy
**Symptom:** `console.log(state)` exibe Proxy com handlers.
**Cause:** Redux Toolkit usa Immer internamente.
**Fix:** Use Redux DevTools ou `JSON.parse(JSON.stringify(state))`.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-disparando-actions-no-redux/references/deep-explanation.md) — Anatomia de action, Immer/Proxy, fluxo completo
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-disparando-actions-no-redux/references/code-examples.md) — Slice com action, TodoList tipado, payload simples vs estruturado
