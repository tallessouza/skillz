---
name: rs-redux-zustand-selecionando-aula-atual
description: "Applies Redux/Zustand state indexing pattern when managing active items in collections. Use when user asks to 'select current item', 'track active index in state', 'switch between items in a list', 'manage current selection with Redux', or 'index-based state tracking'. Enforces index-based tracking over duplicated objects or IDs, selector composition, and callback-based dispatch for nested structures. Make sure to use this skill whenever implementing selection state in Redux or Zustand stores. Not for form state, authentication, or API cache management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: selecionando-aula
  tags: [redux, zustand, index-tracking, selection, selector-composition, state-design]
---

# Selecionando Item Atual com Redux

> Armazene indices no state, nunca objetos duplicados — compose o dado final no selector.

## Rules

1. **Guarde indices, nao objetos** — `currentModuleIndex: 0`, porque duplicar dados cria inconsistencias
2. **Guarde indices, nao IDs** — acesso por indice e O(1), find por ID e O(n)
3. **Compose dados no selector** — `state.player.course.modules[moduleIndex].lessons[lessonIndex]`
4. **Payload com multiplos indices** — `dispatch(play([moduleIndex, lessonIndex]))`
5. **Callback do pai para o filho** — passe `onPlay` do componente que tem os indices

## How to write

```typescript
// State
const initialState = { course: null, currentModuleIndex: 0, currentLessonIndex: 0 }

// Selector que compoe
const currentLesson = useAppSelector((state) => {
  const { currentModuleIndex, currentLessonIndex } = state.player
  return state.player.course?.modules[currentModuleIndex].lessons[currentLessonIndex]
})

// Reducer
play: (state, action: PayloadAction<[number, number]>) => {
  state.currentModuleIndex = action.payload[0]
  state.currentLessonIndex = action.payload[1]
},
```

## Example

**Before:** `activeLesson: { id: 'abc', title: 'Intro' }` (duplicado no state)
**After:** `currentModuleIndex: 0, currentLessonIndex: 0` (indices + selector)

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `activeLesson: { ...obj }` no state | `currentLessonIndex: 0` |
| `lessons.find(l => l.id === activeId)` | `lessons[currentLessonIndex]` |
| `useDispatch()` no filho sem indices | `onPlay` callback do pai |

## Troubleshooting

### State com objeto duplicado dessincroniza
**Symptom:** Aula ativa mostra dados antigos apos recarregar curso.
**Cause:** Objeto duplicado no state nao atualiza quando a fonte muda.
**Fix:** Guarde apenas indices e compose o dado via selector.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-selecionando-aula-atual/references/deep-explanation.md) — 3 abordagens (objeto, ID, indice), estrategia de dispatch pai vs filho
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-selecionando-aula-atual/references/code-examples.md) — Slice completo, Video com selector, Module com dispatch, Lesson com callback
