# Code Examples: Async Thunks no Redux Toolkit

## Exemplo completo do slice com thunk

### Antes — fetch no componente com dispatch manual

```typescript
// player.ts (slice)
const playerSlice = createSlice({
  name: 'player',
  initialState: {
    course: null as Course | null,
    currentModuleIndex: 0,
    currentLessonIndex: 0,
  },
  reducers: {
    start: (state, action: PayloadAction<Course>) => {
      state.course = action.payload
    },
    play: (state, action) => { /* ... */ },
    next: (state) => { /* ... */ },
  },
})

// Player.tsx (componente)
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { api } from '../lib/axios'
import { start } from '../store/slices/player'

function Player() {
  const dispatch = useDispatch()

  useEffect(() => {
    api.get('/courses/1').then(response => {
      dispatch(start(response.data))
    })
  }, [])
}
```

### Depois — com createAsyncThunk

```typescript
// player.ts (slice)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../lib/axios'

export const loadCourse = createAsyncThunk(
  'player/load',
  async () => {
    const response = await api.get('/courses/1')
    return response.data
  }
)

const playerSlice = createSlice({
  name: 'player',
  initialState: {
    course: null as Course | null,
    currentModuleIndex: 0,
    currentLessonIndex: 0,
  },
  reducers: {
    play: (state, action) => { /* ... */ },
    next: (state) => { /* ... */ },
    // start foi removido — nao e mais necessario
  },
  extraReducers: (builder) => {
    builder.addCase(loadCourse.fulfilled, (state, action) => {
      state.course = action.payload
    })
  },
})
```

### Store com useAppDispatch

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import { useSelector, TypedUseSelectorHook, useDispatch } from 'react-redux'
import { playerSlice } from './slices/player'

const store = configureStore({
  reducer: {
    player: playerSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
```

### Componente usando useAppDispatch

```typescript
// Player.tsx
import { useEffect } from 'react'
import { useAppDispatch } from '../store'
import { loadCourse } from '../store/slices/player'

function Player() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadCourse())
  }, [])

  // ... resto do componente
}
```

## Tratando os tres estados do thunk

```typescript
extraReducers: (builder) => {
  builder
    .addCase(loadCourse.pending, (state) => {
      state.isLoading = true
    })
    .addCase(loadCourse.fulfilled, (state, action) => {
      state.course = action.payload
      state.isLoading = false
    })
    .addCase(loadCourse.rejected, (state) => {
      state.isLoading = false
      state.error = 'Falha ao carregar o curso'
    })
},
```

## O que aparece no Redux DevTools

Ao executar `dispatch(loadCourse())`, o DevTools mostra sequencialmente:

1. `player/load/pending` — action disparada imediatamente
2. `player/load/fulfilled` — action disparada apos a promise resolver, com `payload` contendo os dados retornados

Se a requisicao falhar:
1. `player/load/pending`
2. `player/load/rejected` — com informacoes do erro

## Migracao: substituir useDispatch por useAppDispatch

Todos os arquivos que usam `useDispatch` devem ser atualizados:

```typescript
// ANTES
import { useDispatch } from 'react-redux'
const dispatch = useDispatch()

// DEPOIS
import { useAppDispatch } from '../store'
const dispatch = useAppDispatch()
```

Isso nao muda funcionalidade — a unica diferenca e que o TypeScript passa a entender que o dispatch aceita thunks como actions validas.