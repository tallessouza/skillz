---
name: rs-redux-zustand-carregando-dados
description: "Applies the pattern of loading API data into a Redux store with proper TypeScript typing and null-safe state. Use when user asks to 'fetch data into Redux', 'load API data into store', 'create a Redux action for API data', 'type Redux state with nullable fields', or 'handle loading state in Redux'. Covers: typing state with interfaces, nullable course/entity state, optional chaining in selectors, creating payload actions, and dispatching from useEffect. Make sure to use this skill whenever integrating API calls with Redux slices. Not for Zustand stores, React Query, or server-side data fetching."
---

# Carregando Dados da API para o Redux Store

> Ao carregar dados externos para o Redux, tipar o estado como nulo inicialmente e proteger todos os acessos com optional chaining ate os dados estarem disponiveis.

## Rules

1. **Tipar o estado com interface explicita** — crie uma interface `PlayerState` (ou equivalente) que descreva o formato completo do estado, porque o Redux precisa saber o shape desde o inicio
2. **Estado inicial de entidades da API e nulo** — `course: null` ao inves de um objeto vazio, porque um objeto vazio mascara a ausencia real de dados e quebra verificacoes de loading
3. **Proteger acessos com optional chaining** — `state.course?.modules` em todo lugar que acessa dados potencialmente nulos, porque o estado e nulo ate a API responder
4. **Criar action tipada com PayloadAction** — `start(state, action: PayloadAction<Course>)` para receber os dados da API e preencher o estado
5. **Componentes retornam null quando dados nao existem** — `if (!currentLesson) return null` como guard clause, porque renderizar com dados undefined causa crashes
6. **Exportar a action do slice** — `export const { start } = playerSlice.actions`, porque esquecer essa exportacao e um erro silencioso comum

## How to write

### Interface do estado com campo nulo

```typescript
interface Course {
  id: number
  modules: Array<{
    id: number
    title: string
    lessons: Array<{
      id: string
      title: string
      duration: string
    }>
  }>
}

interface PlayerState {
  course: Course | null
  currentModuleIndex: number
  currentLessonIndex: number
}

const initialState: PlayerState = {
  course: null,
  currentModuleIndex: 0,
  currentLessonIndex: 0,
}
```

### Action para receber dados da API

```typescript
const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    start: (state, action: PayloadAction<Course>) => {
      state.course = action.payload
    },
  },
})

export const { start } = playerSlice.actions
```

### Dispatch a partir de useEffect no componente

```typescript
function Player() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    api.get('/courses/1').then((response) => {
      dispatch(start(response.data))
    })
  }, [])
}
```

### Guard clauses nos componentes

```typescript
function Video() {
  const currentLesson = useAppSelector(/* selector */)

  if (!currentLesson) return null

  return <video src={currentLesson.url} />
}
```

## Example

**Before (estado sem tipagem nula):**
```typescript
const initialState = {
  course: {
    id: 1,
    modules: [],
  },
  currentModuleIndex: 0,
  currentLessonIndex: 0,
}
// Problema: parece que os dados existem quando na verdade nao foram carregados
```

**After (com tipagem nula e action de carregamento):**
```typescript
interface PlayerState {
  course: Course | null
  currentModuleIndex: number
  currentLessonIndex: number
}

const initialState: PlayerState = {
  course: null,
  currentModuleIndex: 0,
  currentLessonIndex: 0,
}

// Reducers protegidos com optional chaining
const currentModule = state.course?.modules[state.currentModuleIndex]
const currentLesson = currentModule?.lessons[state.currentLessonIndex]
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dados vem de API | Estado inicial = `null`, nunca objeto vazio |
| Selector acessa dados potencialmente nulos | Optional chaining + nullish coalescing |
| Componente depende de dados da API | Guard clause retornando `null` no topo |
| Multiplos componentes precisam dos mesmos dados | Considerar carregar via async thunk (proxima aula) |
| Array vem de campo nulo | Verificar existencia antes de `.map()` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| `course: {}` (objeto vazio como inicial) | `course: null` |
| `state.course.modules[0]` (sem check) | `state.course?.modules[0]` |
| Fetch inline sem dispatch | Fetch + `dispatch(start(data))` |
| Esquecer `export const { start }` | Sempre exportar actions do slice |
| Renderizar componente sem guard | `if (!data) return null` no topo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/redux-zustand/rs-redux-zustand-carregando-dados-do-curso/references/deep-explanation.md)
- [Code examples](../../../data/skills/redux-zustand/rs-redux-zustand-carregando-dados-do-curso/references/code-examples.md)
