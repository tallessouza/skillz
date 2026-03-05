---
name: rs-redux-zustand-async-thunks
description: "Applies Redux Toolkit createAsyncThunk patterns when writing async Redux logic. Use when user asks to 'fetch data with Redux', 'create async action', 'handle API calls in Redux', 'use createAsyncThunk', or 'add loading states to Redux'. Enforces extraReducers with builder pattern, typed useAppDispatch, and pending/fulfilled/rejected action handling. Make sure to use this skill whenever implementing async operations in Redux Toolkit slices. Not for Zustand async logic, React Query, or non-Redux state management."
---

# Async Thunks no Redux Toolkit

> Operacoes assincronas no Redux vivem em createAsyncThunk, nunca dentro de reducers — reducers sao funcoes puras.

## Rules

1. **Nunca coloque logica assincrona dentro de reducers** — reducers precisam ser funcoes puras sem side effects, porque o Redux exige previsibilidade e testabilidade
2. **Use createAsyncThunk para qualquer operacao async** — chamadas HTTP, promises, qualquer side effect assincrono, porque o thunk gera automaticamente as actions pending/fulfilled/rejected
3. **Nomeie o thunk com o padrao "slice/acao"** — `player/load`, `cart/fetch`, porque o Redux DevTools mostra esse nome e facilita debug
4. **Use extraReducers com builder pattern para ouvir thunks** — `builder.addCase(myThunk.fulfilled, ...)`, porque extraReducers permite que um slice ouca actions de fora dele
5. **Sempre crie useAppDispatch tipado** — `export const useAppDispatch = () => useDispatch<AppDispatch>()`, porque o dispatch padrao do React Redux nao reconhece thunks como actions validas no TypeScript
6. **Retorne dados do thunk para popular o payload** — o return dentro do async thunk vira o `action.payload` do fulfilled

## How to write

### createAsyncThunk

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../lib/axios'

export const loadCourse = createAsyncThunk(
  'player/load',
  async () => {
    const response = await api.get('/courses/1')
    return response.data // vira action.payload no fulfilled
  }
)
```

### extraReducers no slice

```typescript
const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    play: (state, action) => { /* ... */ },
    next: (state) => { /* ... */ },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCourse.fulfilled, (state, action) => {
      state.course = action.payload
    })
  },
})
```

### useAppDispatch tipado

```typescript
// store/index.ts
import { useDispatch } from 'react-redux'

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
```

### Dispatch no componente

```typescript
import { useEffect } from 'react'
import { useAppDispatch } from '../store'
import { loadCourse } from '../store/slices/player'

function Player() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadCourse())
  }, [])
}
```

## Example

**Before (async dentro do componente, dispatch manual):**
```typescript
function Player() {
  const dispatch = useDispatch()

  useEffect(() => {
    api.get('/courses/1').then(response => {
      dispatch(start(response.data.modules))
    })
  }, [])
}
```

**After (com createAsyncThunk):**
```typescript
// slice
export const loadCourse = createAsyncThunk('player/load', async () => {
  const response = await api.get('/courses/1')
  return response.data
})

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: { play: (state, action) => { /* ... */ } },
  extraReducers: (builder) => {
    builder.addCase(loadCourse.fulfilled, (state, action) => {
      state.course = action.payload
    })
  },
})

// componente
function Player() {
  const dispatch = useAppDispatch()
  useEffect(() => { dispatch(loadCourse()) }, [])
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Fetch de dados na montagem do componente | createAsyncThunk + dispatch no useEffect |
| Precisa mostrar loading | Adicione `builder.addCase(thunk.pending, ...)` para setar flag isLoading |
| Precisa tratar erro | Adicione `builder.addCase(thunk.rejected, ...)` |
| Thunk precisa acessar state atual | Use segundo parametro `(_, thunkAPI) => thunkAPI.getState()` |
| Multiplos slices ouvem mesmo thunk | Cada slice adiciona seu proprio extraReducers |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `async` dentro de `reducers: {}` | `createAsyncThunk` + `extraReducers` |
| `useDispatch()` com thunks em TS | `useAppDispatch()` tipado |
| Dispatch manual de action apos fetch no componente | Retorne dados do thunk, trate no extraReducers |
| Nome do thunk sem prefixo do slice | `"player/load"` com nome do slice |
| `extraReducers: { [type]: handler }` (map notation) | `extraReducers: (builder) => builder.addCase(...)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/redux-zustand/rs-redux-zustand-utilizando-async-thunks/references/deep-explanation.md)
- [Code examples](../../../data/skills/redux-zustand/rs-redux-zustand-utilizando-async-thunks/references/code-examples.md)
