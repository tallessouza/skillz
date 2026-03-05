---
name: rs-redux-zustand-setup-do-zustand
description: "Applies Zustand store setup patterns when migrating from Redux or creating new state management. Use when user asks to 'setup Zustand', 'migrate from Redux to Zustand', 'create a Zustand store', 'replace Redux with Zustand', or 'configure global state'. Enforces correct create() usage, typed stores with generics, set/get patterns, and co-located actions with state. Make sure to use this skill whenever setting up Zustand in a React project. Not for Redux Toolkit setup, Context API, Jotai, or other state management libraries."
---

# Setup do Zustand

> Ao configurar Zustand, defina estado e acoes na mesma estrutura, tipados via generic no create(), usando set() para atualizar e get() para ler estado dentro de acoes.

## Rules

1. **Instale apenas zustand** — nao precisa de pacotes extras (`@reduxjs/toolkit`, `react-redux`), porque Zustand e autocontido
2. **Use create() com generic tipado** — `create<StoreType>()` garante que o retorno inicial e as acoes estejam corretos desde o inicio
3. **Acoes ficam junto do estado** — diferente do Redux (slices separados), Zustand retorna dados e metodos no mesmo objeto, porque simplifica a co-locacao
4. **Use set() para atualizar estado** — funciona como setState do React, aceita objeto parcial: `set({ currentModuleIndex: 0 })`
5. **Use get() para ler estado dentro de acoes** — desestruture o retorno: `const { course, currentModuleIndex } = get()`
6. **Receba parametros diretamente nas acoes** — sem action.payload, sem ActionType, porque Zustand nao usa o pattern Flux
7. **Tipe acoes na interface do estado** — inclua assinaturas de funcoes na mesma interface dos dados

## How to write

### Store basico com create()

```typescript
import { create } from 'zustand'

interface PlayerState {
  course: Course | null
  currentModuleIndex: number
  currentLessonIndex: number
  play: (moduleIndex: number, lessonIndex: number) => void
  next: () => void
}

export const useStore = create<PlayerState>((set, get) => {
  return {
    course: null,
    currentModuleIndex: 0,
    currentLessonIndex: 0,

    play: (moduleIndex: number, lessonIndex: number) => {
      set({ currentModuleIndex: moduleIndex, currentLessonIndex: lessonIndex })
    },

    next: () => {
      const { currentLessonIndex, currentModuleIndex, course } = get()

      const nextLessonIndex = currentLessonIndex + 1
      const nextModule = course?.modules[currentModuleIndex]

      if (nextModule && nextLessonIndex < nextModule.lessons.length) {
        set({ currentLessonIndex: nextLessonIndex })
      } else {
        const nextModuleIndex = currentModuleIndex + 1
        if (course?.modules[nextModuleIndex]) {
          set({ currentModuleIndex: nextModuleIndex, currentLessonIndex: 0 })
        }
      }
    },
  }
})
```

## Example

**Before (Redux com slices, reducers, actions):**
```typescript
// slice.ts
const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    play: (state, action: PayloadAction<[number, number]>) => {
      state.currentModuleIndex = action.payload[0]
      state.currentLessonIndex = action.payload[1]
    },
  },
})
export const { play } = playerSlice.actions

// uso no componente
dispatch(play([moduleIndex, lessonIndex]))
```

**After (Zustand — estado + acoes juntos):**
```typescript
// store.ts
export const useStore = create<PlayerState>((set, get) => ({
  currentModuleIndex: 0,
  currentLessonIndex: 0,
  play: (moduleIndex: number, lessonIndex: number) => {
    set({ currentModuleIndex: moduleIndex, currentLessonIndex: lessonIndex })
  },
}))

// uso no componente
const play = useStore(state => state.play)
play(moduleIndex, lessonIndex)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Migrando do Redux | Crie pasta separada (ex: `zustand-store/`), migre aos poucos |
| Acao precisa ler estado atual | Use `get()` para desestruturar valores |
| Acao atualiza multiplos campos | Use um unico `set({ campo1, campo2 })` |
| Tipando a store | Interface unica com dados + assinaturas de acoes |
| Parametros de acao | Receba diretamente na funcao, sem payload wrapper |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `action.payload[0]` | `(moduleIndex: number) => ...` parametro direto |
| `state.currentModuleIndex = x` (mutacao) | `set({ currentModuleIndex: x })` |
| Interface so com dados, sem acoes | Interface com dados + acoes tipadas |
| `createSlice` + `dispatch` com Zustand | `create()` + chamada direta da acao |
| Instalar `react-redux` junto com Zustand | Apenas `zustand` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/redux-zustand/rs-redux-zustand-setup-do-zustand/references/deep-explanation.md)
- [Code examples](../../../data/skills/redux-zustand/rs-redux-zustand-setup-do-zustand/references/code-examples.md)
