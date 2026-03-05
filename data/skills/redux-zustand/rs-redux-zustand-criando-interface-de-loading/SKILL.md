---
name: rs-redux-zustand-loading-interface
description: "Applies loading state patterns in Redux/Zustand stores when implementing async data fetching. Use when user asks to 'add loading state', 'show spinner while fetching', 'handle pending state', 'create loading UI', or 'add isLoading to store'. Enforces pattern: boolean flag in store toggled by pending/fulfilled actions, conditional rendering with spinner or skeleton. Make sure to use this skill whenever adding async operations to Redux or Zustand stores. Not for error handling, optimistic updates, or caching strategies."
---

# Loading State em Redux/Zustand

> Toda operacao assincrona na store deve ter um campo `isLoading` que controla a interface de carregamento.

## Rules

1. **Adicione `isLoading` ao state** — campo booleano no estado inicial, porque a UI precisa de uma flag deterministica para decidir o que renderizar
2. **Pending seta `true`, fulfilled seta `false`** — nunca confie apenas no fulfilled, porque o pending pode ser disparado multiplas vezes (recarregamentos)
3. **Inicialize como `true` se o dado e essencial** — se a tela nao faz sentido sem o dado, comece carregando, porque evita flash de conteudo vazio
4. **Renderize condicionalmente no componente** — `isLoading ? <Spinner /> : <Content />`, porque loading e responsabilidade da UI, nao da store
5. **Atualize testes ao adicionar campos** — todo campo novo no state precisa estar no estado inicial dos testes, porque testes quebram silenciosamente

## How to write

### Campo no state (Redux Toolkit)

```typescript
interface PlayerState {
  // ... campos existentes
  isLoading: boolean
}

const initialState: PlayerState = {
  // ... valores existentes
  isLoading: true,
}
```

### Cases no extraReducers

```typescript
builder.addCase(loadCourse.pending, (state) => {
  state.isLoading = true
})

builder.addCase(loadCourse.fulfilled, (state, action) => {
  state.isLoading = false
  // ... atribuir dados do payload
})
```

### Componente com loading condicional

```tsx
const isCourseLoading = useAppSelector(
  (state) => state.player.isLoading
)

return isCourseLoading ? (
  <div className="flex h-full items-center justify-center">
    <Loader className="w-6 h-6 text-zinc-400 animate-spin" />
  </div>
) : (
  <VideoPlayer lesson={currentLesson} />
)
```

## Example

**Before (sem loading — flash de conteudo vazio):**

```tsx
// Store sem isLoading
const initialState = {
  course: null,
  currentModuleIndex: 0,
  currentLessonIndex: 0,
}

// Componente renderiza null enquanto carrega
export function Video() {
  const lesson = useAppSelector(/* ... */)
  return <ReactPlayer url={lesson?.videoUrl} /> // undefined no primeiro render
}
```

**After (com loading state):**

```tsx
// Store com isLoading
const initialState = {
  course: null,
  currentModuleIndex: 0,
  currentLessonIndex: 0,
  isLoading: true,
}

// extraReducers
builder.addCase(loadCourse.pending, (state) => {
  state.isLoading = true
})
builder.addCase(loadCourse.fulfilled, (state, action) => {
  state.isLoading = false
  state.course = action.payload
})

// Componente com feedback visual
export function Video() {
  const isCourseLoading = useAppSelector(state => state.player.isLoading)
  const lesson = useAppSelector(/* ... */)

  if (isCourseLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="w-6 h-6 text-zinc-400 animate-spin" />
      </div>
    )
  }

  return <ReactPlayer url={lesson?.videoUrl} />
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Dado essencial para a tela | `isLoading: true` no initial state |
| Dado opcional/secundario | `isLoading: false` no initial state |
| Multiplos recursos async | Um `isLoading` por recurso, nao um global |
| Sidebar/header tambem dependem do dado | Reutilize o mesmo selector `state.player.isLoading` |
| Quer skeleton screen ao inves de spinner | Use `animate-pulse` do Tailwind em divs placeholder |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Checar `if (!course)` como proxy de loading | Usar `isLoading` explicito na store |
| Setar loading apenas no fulfilled | Setar no pending (`true`) E no fulfilled (`false`) |
| Loading global para toda a app | Loading por slice/feature |
| Esquecer de atualizar testes com novo campo | Adicionar `isLoading` no initialState dos testes |
| Optional chaining como substituto de loading | Optional chaining + loading state juntos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
