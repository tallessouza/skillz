---
name: rs-redux-zustand-migrando-do-redux-p-zustand
description: "Applies Zustand migration patterns when refactoring React state management from Redux Toolkit to Zustand. Use when user asks to 'migrate from Redux to Zustand', 'replace Redux with Zustand', 'convert Redux store to Zustand', 'refactor from Redux', 'remove Redux Provider', or 'zustand async actions'. Covers Provider removal, async action migration, selector conversion, and component-by-component migration. Make sure to use this skill whenever converting existing Redux code to Zustand. Not for initial Zustand setup from scratch (use setup-do-zustand), Redux configuration, or Jotai/Recoil."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: migrando-redux-zustand
  tags: [zustand, migration, redux-to-zustand, async, provider-removal, refactoring]
---

# Migrando do Redux para Zustand

> Substitua providers, dispatches e selectors por uma unica store com acesso direto.

## Rules

1. **Remova o Provider** — Zustand nao usa Context API
2. **Unifique estado e acoes** — nao separe selector e dispatch
3. **Async como metodos diretos** — `async load()` dentro de create(), sem createAsyncThunk
4. **Sempre use selector** — `useStore(s => s.field)` nunca `useStore()` vazio, porque re-renderiza tudo
5. **Loading dentro da acao** — `set({ isLoading: true })` antes, `set({ isLoading: false })` depois
6. **Hooks derivados migram facilmente** — troque useAppSelector por useStore

## How to write

```typescript
// Redux → Zustand mapping
// configureStore → create()
// createSlice reducers → metodos no create()
// createAsyncThunk → async method no create()
// useAppSelector → useStore(s => s.field)
// dispatch(action()) → const action = useStore(s => s.action); action()
// <Provider store={store}> → nada (remova)

export const useStore = create<Store>((set) => ({
  course: null, isLoading: false,
  load: async () => {
    set({ isLoading: true })
    const response = await api.get('/courses/1')
    set({ course: response.data, isLoading: false })
  },
}))
```

## Example

**Before (Redux):**
```typescript
<Provider store={store}><App /></Provider>
dispatch(loadCourse()) // createAsyncThunk
useAppSelector(state => state.player.isLoading)
```

**After (Zustand):**
```typescript
<App /> // sem Provider
load() // chamada direta de async
useStore(store => store.isLoading)
```

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| `useStore()` sem selector | `useStore(s => s.value)` |
| `dispatch(actionCreator())` | `const action = useStore(s => s.action); action()` |
| `<Provider store={store}>` | Sem provider |
| `createAsyncThunk` | `load: async () => { set(...) }` |

## Troubleshooting

### Componente re-renderiza em toda mudanca
**Symptom:** Performance pior que Redux apos migracao.
**Cause:** `useStore()` chamado sem selector — observa todo o estado.
**Fix:** Sempre passe funcao seletora: `useStore(s => s.specificField)`.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-migrando-do-redux-p-zustand/references/deep-explanation.md) — Async simplificado, Provider eliminado, selector obrigatorio, migracao incremental
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-migrando-do-redux-p-zustand/references/code-examples.md) — Store completa, hook derivado, Player/Header/Module/Video migrados, tabela de mapeamento
