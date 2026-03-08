---
name: rs-redux-zustand-criando-reducer-do-player
description: "Enforces Redux Toolkit createSlice patterns and granular useSelector best practices when building state slices. Use when user asks to 'create a slice', 'setup Redux state', 'use useSelector correctly', 'manage nested state with Redux', or 'create a reducer'. Applies granular selectors, proper slice export, and store registration patterns. Make sure to use this skill whenever writing Redux Toolkit slices or reviewing selector usage for performance. Not for Zustand stores (use setup-do-zustand), Context API, or non-Redux state."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: criando-reducer
  tags: [redux-toolkit, createSlice, useSelector, selectors, performance, react]
---

# Criando Reducer do Player com Redux Toolkit

> Estruture o estado inicial com dados tipados, exporte apenas o reducer, e use selectors granulares.

## Rules

1. **Use `createSlice`** — nunca crie reducers com switch/case manual, porque Toolkit garante imutabilidade via Immer
2. **Exporte o reducer, nao o slice** — `export const player = playerSlice.reducer`
3. **Selectors granulares** — acesse `state.player.course.modules`, nunca `state.player` inteiro, porque Redux so re-renderiza quando o dado especifico muda
4. **Nunca desestruture dentro do selector** — retorne o campo exato, porque desestruturacao quebra otimizacao de re-render
5. **Multiplos campos = multiplos selectors** — um `useAppSelector` por campo necessario

## How to write

```typescript
// Correto — granular
const modules = useAppSelector(state => state.player.course.modules)
// Errado — re-renderiza em qualquer mudanca do player
const { course } = useAppSelector(state => state.player)
```

## Example

**Before:** `const { course, currentLesson } = useAppSelector(state => state.player)`
**After:** `const modules = useAppSelector(state => state.player.course.modules)`

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `return state.player` | `return state.player.course.modules` |
| `export default playerSlice` | `export const player = playerSlice.reducer` |

## Troubleshooting

### Componente re-renderiza em toda mudanca de state
**Symptom:** Componente que mostra modules re-renderiza quando currentLessonIndex muda.
**Cause:** Selector retorna o slice inteiro.
**Fix:** Acesse o campo exato: `state.player.course.modules`.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-criando-reducer-do-player/references/deep-explanation.md) — Selectors granulares vs Context API, organizacao de pastas
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-criando-reducer-do-player/references/code-examples.md) — Slice completo, store registration, consumindo modules e lessons
