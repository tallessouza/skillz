---
name: rs-redux-zustand-utilizando-async-thunks
description: "Applies Redux Toolkit createAsyncThunk patterns when implementing async operations in Redux. Use when user asks to 'fetch data with Redux', 'create async action', 'handle API calls in Redux', 'use createAsyncThunk', 'add loading states to Redux', or 'extraReducers builder pattern'. Enforces builder pattern, typed useAppDispatch, and pending/fulfilled/rejected handling. Make sure to use this skill whenever implementing async operations in Redux Toolkit slices. Not for Zustand async logic (use migrando-do-redux-p-zustand), React Query, or non-Redux state."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: async-thunks
  tags: [redux-toolkit, createAsyncThunk, extraReducers, builder, async, loading]
---

# Async Thunks no Redux Toolkit

> Operacoes assincronas vivem em createAsyncThunk, nunca dentro de reducers — reducers sao funcoes puras.

## Rules

1. **Nunca async dentro de reducers** — reducers sao funcoes puras sem side effects
2. **createAsyncThunk para async** — gera automaticamente pending/fulfilled/rejected
3. **Nomeie "slice/acao"** — `player/load` para facilitar debug no DevTools
4. **extraReducers com builder** — `builder.addCase(thunk.fulfilled, handler)`
5. **useAppDispatch tipado** — `useDispatch<AppDispatch>()`, porque dispatch padrao nao reconhece thunks
6. **Retorno do thunk = payload** — o return vira `action.payload` no fulfilled

## How to write

```typescript
export const loadCourse = createAsyncThunk('player/load', async () => {
  const response = await api.get('/courses/1')
  return response.data
})

// No slice
extraReducers: (builder) => {
  builder.addCase(loadCourse.fulfilled, (state, action) => {
    state.course = action.payload
  })
},

// Store
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

// Componente
const dispatch = useAppDispatch()
useEffect(() => { dispatch(loadCourse()) }, [])
```

## Example

**Before:** fetch no componente + dispatch manual de action
**After:** createAsyncThunk + extraReducers + useAppDispatch tipado

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `async` dentro de `reducers: {}` | `createAsyncThunk` + `extraReducers` |
| `useDispatch()` com thunks em TS | `useAppDispatch()` tipado |
| `extraReducers: { [type]: handler }` | `extraReducers: (builder) => builder.addCase(...)` |

## Troubleshooting

### TypeScript: "is not assignable to parameter of type AnyAction"
**Symptom:** `dispatch(loadCourse())` mostra erro de tipo.
**Cause:** `useDispatch` padrao nao reconhece thunks.
**Fix:** Crie `useAppDispatch` tipado com `AppDispatch = typeof store.dispatch`.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-utilizando-async-thunks/references/deep-explanation.md) — Por que reducers puros, 3 actions automaticas, extraReducers, TypeScript
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-utilizando-async-thunks/references/code-examples.md) — Antes/depois, store com useAppDispatch, 3 estados do thunk, DevTools
