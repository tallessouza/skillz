---
name: rs-redux-zustand-migrando-redux-zustand
description: "Applies Zustand migration patterns when refactoring React state management from Redux to Zustand. Use when user asks to 'migrate from Redux', 'replace Redux with Zustand', 'convert Redux store', 'refactor state management', or 'use Zustand instead of Redux'. Covers store creation, async actions, selective subscriptions, and component migration. Make sure to use this skill whenever converting Redux code to Zustand in any React project. Not for initial Zustand setup from scratch, Redux Toolkit configuration, or other state management libraries like Jotai or Recoil."
---

# Migrando do Redux para Zustand

> Ao migrar de Redux para Zustand, substitua providers, dispatches e selectors por uma unica store com acesso direto a estado e acoes.

## Rules

1. **Remova o Provider global** — Zustand nao usa Context API, entao delete o `<Provider store={store}>` do App, porque Zustand acessa estado sem wrapper
2. **Unifique estado e acoes no useStore** — nao separe `useSelector` e `useDispatch`, porque Zustand retorna ambos de uma unica chamada
3. **Acoes assincronas sao metodos diretos** — crie `async load()` dentro do `create()`, nao use `createAsyncThunk`, porque Zustand permite async nativamente
4. **Sempre use selector no useStore** — `useStore(store => store.isLoading)` nao `useStore()`, porque sem selector o componente re-renderiza em qualquer mudanca de estado
5. **Gerencie loading dentro da propria acao** — faca `set({ isLoading: true })` antes da request e `set({ isLoading: false })` depois, porque elimina reducers de case separados
6. **Hooks derivados ficam junto ao store** — crie hooks como `useCurrentLesson` no mesmo arquivo do store, porque acessam `useStore` diretamente

## How to write

### Store com acao assincrona

```typescript
import { create } from 'zustand'
import { api } from '../lib/axios'

interface Store {
  course: Course | null
  isLoading: boolean
  load: () => Promise<void>
}

export const useStore = create<Store>((set) => ({
  course: null,
  isLoading: false,

  load: async () => {
    set({ isLoading: true })
    const response = await api.get('/courses/1')
    set({ course: response.data, isLoading: false })
  },
}))
```

### Selector no componente

```typescript
// Selecione apenas o que precisa — evita re-renders
const isLoading = useStore(store => store.isLoading)
const next = useStore(store => store.next)

// Ou multiplos valores num unico selector
const { currentLessonIndex, currentModuleIndex, play } = useStore(store => ({
  currentLessonIndex: store.currentLessonIndex,
  currentModuleIndex: store.currentModuleIndex,
  play: store.play,
}))
```

### Hook derivado no arquivo do store

```typescript
export function useCurrentLesson() {
  return useStore(store => {
    const currentModule = store.course?.modules[store.currentModuleIndex]
    const currentLesson = currentModule?.lessons[store.currentLessonIndex]
    return { currentModule, currentLesson }
  })
}
```

## Example

**Before (Redux):**
```typescript
// App.tsx
import { Provider } from 'react-redux'
import { store } from './store'
<Provider store={store}><App /></Provider>

// Component
const dispatch = useAppDispatch()
const modules = useAppSelector(state => state.player.course?.modules)
const isCourseLoading = useAppSelector(state => state.player.isLoading)

useEffect(() => {
  dispatch(loadCourse())
}, [])
```

**After (Zustand):**
```typescript
// App.tsx — sem Provider
<App />

// Component
const modules = useStore(store => store.course?.modules)
const isLoading = useStore(store => store.isLoading)
const load = useStore(store => store.load)

useEffect(() => {
  load()
}, [])
```

## Heuristics

| Situacao | Faca |
|----------|------|
| `createAsyncThunk` no Redux | Metodo async direto no `create()` do Zustand |
| `useAppDispatch` + action | Pegue a funcao direto do `useStore(s => s.action)` |
| `useAppSelector` | `useStore(store => store.campo)` |
| Provider no App root | Remova completamente |
| Reducer com cases de loading | `set()` dentro da propria acao async |
| Hook customizado com useSelector | Mesmo hook, troque useSelector por useStore |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| `const store = useStore()` (sem selector) | `const value = useStore(s => s.value)` |
| `dispatch(actionCreator())` | `const action = useStore(s => s.action); action()` |
| `<Provider store={store}>` | Sem provider — Zustand nao precisa |
| `createAsyncThunk('name', async ...)` | `load: async () => { set(...); await api... }` |
| Reducers separados para pending/fulfilled/rejected | `set({ isLoading: true/false })` dentro da acao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/redux-zustand/rs-redux-zustand-migrando-do-redux-p-zustand/references/deep-explanation.md)
- [Code examples](../../../data/skills/redux-zustand/rs-redux-zustand-migrando-do-redux-p-zustand/references/code-examples.md)
