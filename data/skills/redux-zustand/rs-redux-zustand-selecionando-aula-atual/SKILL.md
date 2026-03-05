---
name: rs-redux-zustand-selecionando-aula-atual
description: "Applies Redux state indexing pattern when managing active items in collections. Use when user asks to 'select current item', 'track active index', 'switch between items in a list', or 'manage current selection with Redux/Zustand'. Enforces index-based tracking over storing duplicated objects or IDs, proper useAppSelector composition, and action payload design for multi-dimensional indices. Make sure to use this skill whenever implementing selection state in Redux or Zustand stores. Not for form state, authentication, or API cache management."
---

# Selecionando Item Atual com Redux

> Armazene indices no state, nunca objetos duplicados — compose o dado final no selector.

## Rules

1. **Guarde indices, nao objetos** — `currentModuleIndex: 0` nao `activeLesson: { ...lesson }`, porque duplicar dados no state cria inconsistencias quando a fonte muda
2. **Guarde indices, nao IDs** — indices permitem acesso direto `modules[i].lessons[j]`, enquanto IDs exigem `.find()` em cada render, porque acesso por indice e O(1) vs find e O(n)
3. **Compose dados no selector** — o selector acessa `state.player.course.modules[moduleIndex].lessons[lessonIndex]` e retorna o objeto final, porque o state fica minimo e o componente recebe dados prontos
4. **Payload de action com multiplos indices** — quando a selecao depende de mais de uma dimensao (modulo + aula), envie ambos no payload como array ou objeto
5. **Dispatch no componente pai** — quando o componente filho nao tem acesso aos indices, passe um callback `onPlay` do pai que tem os indices via `.map()`

## How to write

### State inicial com indices

```typescript
const initialState = {
  course: null as Course | null,
  currentModuleIndex: 0,
  currentLessonIndex: 0,
}
```

### Selector que compoe o dado final

```typescript
const currentLesson = useAppSelector((state) => {
  const { currentModuleIndex, currentLessonIndex } = state.player

  return state.player.course?.modules[currentModuleIndex]
    .lessons[currentLessonIndex]
})
```

### Reducer que atualiza indices

```typescript
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
```

### Dispatch via callback do pai

```typescript
// Module.tsx (pai — tem acesso aos indices)
function Module({ moduleIndex }: { moduleIndex: number }) {
  const dispatch = useDispatch()

  return lessons.map((lesson, lessonIndex) => (
    <Lesson
      key={lesson.id}
      onPlay={() => dispatch(play([moduleIndex, lessonIndex]))}
    />
  ))
}

// Lesson.tsx (filho — recebe callback)
function Lesson({ onPlay }: { onPlay: () => void }) {
  return <button onClick={onPlay}>{/* ... */}</button>
}
```

## Example

**Before (objeto duplicado no state):**
```typescript
const initialState = {
  course: courseData,
  activeLesson: { id: 'abc', title: 'Intro', duration: '09:13' }, // duplicado!
}
```

**After (indices + selector):**
```typescript
const initialState = {
  course: courseData,
  currentModuleIndex: 0,
  currentLessonIndex: 0,
}

// Selector compoe o dado
const lesson = useAppSelector((state) =>
  state.player.course?.modules[state.player.currentModuleIndex]
    .lessons[state.player.currentLessonIndex]
)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Lista com item ativo | Guarde indice, compose no selector |
| Selecao em estrutura aninhada (modulo > aula) | Guarde um indice por nivel |
| Componente filho precisa disparar selecao | Passe callback `onPlay` do pai |
| Precisa do objeto completo no componente | Retorne do selector, nunca do state |
| State inicial da selecao | Comece com 0 (primeiro item) |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `activeLesson: { ...lessonObj }` no state | `currentLessonIndex: 0` |
| `activeLessonId: 'abc-123'` no state | `currentLessonIndex: 0` |
| `lessons.find(l => l.id === activeId)` no selector | `lessons[currentLessonIndex]` |
| `dispatch(play('abc-123'))` com ID | `dispatch(play([moduleIndex, lessonIndex]))` |
| `useDispatch()` no filho sem acesso aos indices | `onPlay` callback do pai |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
