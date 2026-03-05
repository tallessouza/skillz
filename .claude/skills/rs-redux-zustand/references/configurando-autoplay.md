---
name: rs-redux-zustand-configurando-autoplay
description: "Applies automatic lesson progression patterns when building video players with Redux/Zustand. Use when user asks to 'implement autoplay', 'play next video', 'auto advance playlist', 'next lesson logic', or builds any sequential content player. Enforces proper reducer logic for navigating modules and lessons with boundary checks. Make sure to use this skill whenever implementing playlist progression or sequential content navigation in React. Not for video encoding, streaming infrastructure, or media upload features."
---

# Configurando Autoplay com Redux

> Ao implementar progressao automatica em players, trate todas as fronteiras de navegacao (proxima aula, proximo modulo, fim do curso) dentro do reducer.

## Rules

1. **Crie uma action `next` sem payload** — o reducer ja conhece o estado atual (currentModuleIndex, currentLessonIndex), porque o estado interno e suficiente para calcular o proximo item
2. **Verifique a proxima lesson antes de avancar** — incremente o lessonIndex e confirme que o item existe no array, porque avancar cegamente causa index out of bounds
3. **Trate fronteira de modulo** — se nao existe proxima lesson, verifique se existe proximo modulo e resete lessonIndex para 0, porque o usuario espera continuidade automatica
4. **Use `playing={true}` no ReactPlayer** — sem autoplay habilitado, a navegacao funciona mas o video nao inicia sozinho
5. **Type actions com PayloadAction** — use `PayloadAction<[number, number]>` para actions com payload e omita o generic para actions sem payload, porque TypeScript infere corretamente

## How to write

### Action next no slice

```typescript
// reducers dentro do createSlice
next: (state) => {
  const nextLessonIndex = state.currentLessonIndex + 1
  const nextLesson =
    state.course.modules[state.currentModuleIndex].lessons[nextLessonIndex]

  if (nextLesson) {
    state.currentLessonIndex = nextLessonIndex
  } else {
    const nextModuleIndex = state.currentModuleIndex + 1
    const nextModule = state.course.modules[nextModuleIndex]

    if (nextModule) {
      state.currentModuleIndex = nextModuleIndex
      state.currentLessonIndex = 0
    }
  }
},
```

### Dispatch no componente Video

```typescript
function Video() {
  const dispatch = useAppDispatch()

  function handlePlayNext() {
    dispatch(next())
  }

  return (
    <ReactPlayer
      onEnded={handlePlayNext}
      playing={true}
      // ...outras props
    />
  )
}
```

### Tipagem de PayloadAction

```typescript
import { PayloadAction } from '@reduxjs/toolkit'

// Com payload tipado
play: (state, action: PayloadAction<[number, number]>) => {
  state.currentModuleIndex = action.payload[0]
  state.currentLessonIndex = action.payload[1]
},

// Sem payload — omita o tipo, TypeScript entende que e vazio
next: (state) => {
  // ...
},
```

## Example

**Before (sem tratamento de fronteiras):**

```typescript
next: (state) => {
  state.currentLessonIndex += 1 // quebra no fim do modulo
},
```

**After (com todas as fronteiras tratadas):**

```typescript
next: (state) => {
  const nextLessonIndex = state.currentLessonIndex + 1
  const nextLesson =
    state.course.modules[state.currentModuleIndex].lessons[nextLessonIndex]

  if (nextLesson) {
    state.currentLessonIndex = nextLessonIndex
  } else {
    const nextModuleIndex = state.currentModuleIndex + 1
    const nextModule = state.course.modules[nextModuleIndex]

    if (nextModule) {
      state.currentModuleIndex = nextModuleIndex
      state.currentLessonIndex = 0
    }
  }
},
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Proxima lesson existe | Incrementa currentLessonIndex |
| Proxima lesson nao existe, proximo modulo existe | Incrementa currentModuleIndex, reseta currentLessonIndex para 0 |
| Nem proxima lesson nem proximo modulo existem | Nao faz nada (fim do curso) |
| Action nao precisa de dados externos | Omita payload, use apenas state |
| Collapsible do primeiro modulo | Use `defaultOpen={moduleIndex === 0}` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `state.currentLessonIndex += 1` sem verificar | Verifique existencia antes de incrementar |
| `dispatch(next("test"))` com payload desnecessario | `dispatch(next())` sem argumento |
| `<ReactPlayer />` sem `playing={true}` | `<ReactPlayer playing={true} />` para autoplay |
| `action: PayloadAction` sem generic quando tem payload | `action: PayloadAction<[number, number]>` |
| `onEnded={() => dispatch(next("test"))}` | `onEnded={handlePlayNext}` com funcao nomeada |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/redux-zustand/rs-redux-zustand-configurando-autoplay/references/deep-explanation.md)
- [Code examples](../../../data/skills/redux-zustand/rs-redux-zustand-configurando-autoplay/references/code-examples.md)
