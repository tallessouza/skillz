---
name: rs-redux-zustand-setup-do-zustand
description: "Applies Zustand store setup patterns when creating new state management or comparing with Redux. Use when user asks to 'setup Zustand', 'create a Zustand store', 'replace Redux with Zustand', 'configure global state with Zustand', 'use create() from zustand', or 'set and get in Zustand'. Enforces create() with generics, co-located actions, set/get patterns, and direct function calls without dispatch. Make sure to use this skill whenever setting up Zustand in a React project. Not for Redux Toolkit setup (use criando-store-do-redux), Context API, Jotai, or Recoil."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: setup-zustand
  tags: [zustand, create, set, get, state-management, react, no-provider]
---

# Setup do Zustand

> Defina estado e acoes na mesma estrutura, tipados via generic no create(), usando set() para atualizar e get() para ler.

## Rules

1. **Apenas `zustand`** — sem pacotes extras como react-redux
2. **create() com generic** — `create<StoreType>()` para tipagem completa
3. **Acoes junto do estado** — dados e metodos no mesmo objeto retornado
4. **set() para atualizar** — objeto parcial: `set({ currentModuleIndex: 0 })`
5. **get() para ler dentro de acoes** — `const { course } = get()`
6. **Parametros diretos** — sem action.payload, sem dispatch
7. **Sem Provider** — Zustand nao usa Context API

## How to write

```typescript
import { create } from 'zustand'

interface PlayerState {
  course: Course | null
  currentModuleIndex: number
  play: (moduleIndex: number, lessonIndex: number) => void
  next: () => void
}

export const useStore = create<PlayerState>((set, get) => ({
  course: null,
  currentModuleIndex: 0,
  currentLessonIndex: 0,
  play: (moduleIndex, lessonIndex) => {
    set({ currentModuleIndex: moduleIndex, currentLessonIndex: lessonIndex })
  },
  next: () => {
    const { currentLessonIndex, currentModuleIndex, course } = get()
    // logica de fronteira...
  },
}))

// Componente — sem dispatch!
const play = useStore(state => state.play)
play(0, 1)
```

## Example

**Before (Redux):** `dispatch(play([moduleIndex, lessonIndex]))`
**After (Zustand):** `play(moduleIndex, lessonIndex)` — chamada direta

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `action.payload[0]` | `(moduleIndex: number) => ...` |
| `state.currentModuleIndex = x` (mutacao) | `set({ currentModuleIndex: x })` |
| `createSlice` + `dispatch` | `create()` + chamada direta |
| Instalar `react-redux` com Zustand | Apenas `zustand` |

## Troubleshooting

### Zustand usa signals, nao PubSub
**Symptom:** Desenvolvedor espera que Zustand funcione como Redux internamente.
**Cause:** Redux usa PubSub (componente observa), Zustand usa signals (variavel avisa).
**Fix:** Entenda que Zustand notifica diretamente o componente, resultando em melhor performance.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-setup-do-zustand/references/deep-explanation.md) — Zustand vs Redux, sem Provider, signals, analogia com useState
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-setup-do-zustand/references/code-examples.md) — Instalacao, store completo, comparacao lado a lado, get() dentro de acoes
