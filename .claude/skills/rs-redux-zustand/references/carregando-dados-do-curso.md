---
name: rs-redux-zustand-carregando-dados-do-curso
description: "Applies the pattern of loading API data into a Redux store with proper TypeScript typing and null-safe initial state. Use when user asks to 'fetch data into Redux', 'load API data into store', 'type Redux state with nullable fields', 'handle null initial state', or 'optional chaining in Redux selectors'. Covers typed interfaces, nullable entity state, guard clauses, and dispatching from useEffect. Make sure to use this skill whenever integrating API calls with Redux slices that start with null data. Not for Zustand stores (use migrando-do-redux-p-zustand), React Query, or server-side data fetching."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: carregando-dados
  tags: [redux, typescript, nullable-state, optional-chaining, api-loading, guard-clause]
---

# Carregando Dados da API para o Redux Store

> Estado inicial de dados da API e null, e todos os acessos usam optional chaining ate os dados estarem disponiveis.

## Rules

1. **Interface explicita** — crie `PlayerState` com `course: Course | null`
2. **Estado inicial nulo** — `course: null`, nunca objeto vazio, porque mascara ausencia de dados
3. **Optional chaining em toda parte** — `state.course?.modules` em selectors e reducers
4. **Guard clauses nos componentes** — `if (!currentLesson) return null`
5. **Exporte a action** — `export const { start } = playerSlice.actions` (esquecer e erro silencioso)

## How to write

```typescript
interface PlayerState { course: Course | null; currentModuleIndex: number; currentLessonIndex: number }
const initialState: PlayerState = { course: null, currentModuleIndex: 0, currentLessonIndex: 0 }

// Action
start: (state, action: PayloadAction<Course>) => { state.course = action.payload },

// Componente
useEffect(() => { api.get('/courses/1').then(r => dispatch(start(r.data))) }, [])

// Guard clause
if (!currentLesson) return null
```

## Example

**Before:** `course: { id: 1, modules: [] }` — parece que dados existem quando nao foram carregados
**After:** `course: null` — TypeScript forca optional chaining em todo acesso

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| `course: {}` (objeto vazio) | `course: null` |
| `state.course.modules[0]` sem check | `state.course?.modules[0]` |
| Renderizar sem guard clause | `if (!data) return null` |

## Troubleshooting

### TypeError: Cannot read properties of null
**Symptom:** Crash ao acessar `course.modules` antes da API responder.
**Cause:** Estado inicial e null mas componente acessa sem optional chaining.
**Fix:** Adicione `?.` em toda cadeia: `state.course?.modules[idx]?.lessons[idx]`.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-carregando-dados-do-curso/references/deep-explanation.md) — Null vs objeto vazio, optional chaining cascata, limitacao de useEffect
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-carregando-dados-do-curso/references/code-examples.md) — Interface, slice com start, Player useEffect, guard clauses
