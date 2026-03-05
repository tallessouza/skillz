---
name: rs-redux-zustand-criando-reducer-do-player
description: "Enforces Redux Toolkit slice creation patterns and useSelector best practices when building state management with Redux. Use when user asks to 'create a slice', 'setup Redux store', 'use useSelector', 'manage state with Redux', or 'create a reducer'. Applies rules: granular selectors instead of returning full state, createSlice structure, proper slice export and store registration. Make sure to use this skill whenever generating Redux Toolkit code or reviewing selector usage. Not for Zustand, Context API, or non-Redux state management."
---

# Criando Reducer do Player com Redux Toolkit

> Ao criar slices Redux, estruture o estado inicial com dados tipados, exporte apenas o reducer, e use selectors granulares que acessam exatamente a informacao necessaria.

## Rules

1. **Use `createSlice` do Redux Toolkit** — nunca crie reducers manualmente com switch/case, porque o Toolkit elimina boilerplate e garante imutabilidade automatica
2. **Exporte o reducer, nao o slice** — `export const player = playerSlice.reducer`, porque o store espera reducers, nao slices
3. **Selectors devem ser granulares** — acesse `state.player.course.modules`, nunca retorne `state.player` inteiro, porque o Redux so re-renderiza quando a informacao especifica muda
4. **Nunca desestruture dentro do selector** — retorne exatamente o campo que precisa, porque desestruturacao quebra a otimizacao de re-render do Redux
5. **Estruture o initialState como resposta de API** — use ids, titulos e arrays aninhados como se viessem de um backend, porque facilita a integracao futura
6. **Registre cada slice no combineReducers** — adicione o reducer exportado no `store/index.ts`, porque slices nao registrados sao silenciosamente ignorados

## How to write

### Criando um slice

```typescript
import { createSlice } from '@reduxjs/toolkit'

const playerSlice = createSlice({
  name: 'player',
  initialState: {
    course: {
      modules: [
        {
          id: '1',
          title: 'Modulo 1',
          lessons: [
            { id: 'abc123', title: 'Aula 1', duration: '09:13' },
          ],
        },
      ],
    },
  },
  reducers: {},
})

export const player = playerSlice.reducer
```

### Registrando no store

```typescript
import { player } from './slices/player'

export const store = configureStore({
  reducer: { player },
})
```

### Selector granular (correto)

```typescript
const modules = useAppSelector(state => state.player.course.modules)
```

### Multiplas informacoes do estado

```typescript
const modules = useAppSelector(state => state.player.course.modules)
const outraInfo = useAppSelector(state => state.player.outroCampo)
// Use dois selectors separados, cada um granular
```

## Example

**Before (selector generico — causa re-renders desnecessarios):**
```typescript
const { course, currentLesson } = useAppSelector(state => state.player)
const modules = course.modules
```

**After (selector granular — re-renderiza apenas quando modules muda):**
```typescript
const modules = useAppSelector(state => state.player.course.modules)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa de um campo do state | Selector que acessa o campo exato |
| Precisa de multiplos campos | Multiplos `useAppSelector`, um por campo |
| Dados aninhados (modules[i].lessons) | Selector com indice: `state.player.course.modules[index].lessons` |
| Slice sem actions ainda | Deixe `reducers: {}` vazio, adicione depois |
| Nomeando o slice | Use o nome do dominio: `player`, `cart`, `auth` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `return state.player` (slice inteiro) | `return state.player.course.modules` (campo especifico) |
| `const { modules, ...rest } = useAppSelector(s => s.player)` | `const modules = useAppSelector(s => s.player.course.modules)` |
| `export default playerSlice` | `export const player = playerSlice.reducer` |
| `createReducer` com switch/case manual | `createSlice` com reducers object |
| Dados mockados sem estrutura de API | initialState com ids, arrays, campos tipados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/redux-zustand/rs-redux-zustand-criando-reducer-do-player/references/deep-explanation.md)
- [Code examples](../../../data/skills/redux-zustand/rs-redux-zustand-criando-reducer-do-player/references/code-examples.md)
