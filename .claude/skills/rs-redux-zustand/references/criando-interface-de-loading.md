---
name: rs-redux-zustand-criando-interface-de-loading
description: "Applies loading state patterns in Redux/Zustand stores when implementing async data fetching with visual feedback. Use when user asks to 'add loading state', 'show spinner while fetching', 'handle pending state', 'create loading UI', 'add isLoading to store', or 'skeleton screen with tailwind'. Enforces boolean isLoading flag toggled by pending/fulfilled, conditional rendering, and animate-spin/animate-pulse patterns. Make sure to use this skill whenever adding async operations to Redux or Zustand stores. Not for error handling patterns, optimistic updates, or caching strategies."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: loading-interface
  tags: [loading, isLoading, spinner, skeleton, pending, fulfilled, async]
---

# Loading State em Redux/Zustand

> Toda operacao assincrona na store deve ter um campo `isLoading` que controla a interface.

## Rules

1. **`isLoading` no state** — campo booleano para decidir o que renderizar
2. **Pending seta true, fulfilled seta false** — nao confie apenas no fulfilled
3. **Inicialize como `true` se dado e essencial** — evita flash de conteudo vazio
4. **Renderize condicionalmente** — `isLoading ? <Spinner /> : <Content />`
5. **Atualize testes** — novo campo no state precisa estar no initialState dos testes

## How to write

```typescript
// State
interface PlayerState { course: Course | null; isLoading: boolean }
const initialState: PlayerState = { course: null, isLoading: true }

// extraReducers
builder.addCase(loadCourse.pending, (state) => { state.isLoading = true })
builder.addCase(loadCourse.fulfilled, (state, action) => {
  state.isLoading = false; state.course = action.payload
})

// Componente
if (isCourseLoading) return <Loader className="animate-spin" />
return <VideoPlayer lesson={currentLesson} />
```

## Example

**Before:** `if (!course) return null` — flash de vazio, sem feedback visual
**After:** `if (isLoading) return <Loader className="animate-spin" />` — spinner enquanto carrega

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `if (!course)` como proxy de loading | `isLoading` explicito |
| Loading apenas no fulfilled | Setar no pending E no fulfilled |
| Loading global para toda app | Loading por slice/feature |

## Troubleshooting

### Testes quebram apos adicionar isLoading
**Symptom:** Testes existentes falham com propriedade faltando.
**Cause:** `isLoading` nao esta no initialState dos testes.
**Fix:** Adicione `isLoading: false` (ou true) no estado de teste.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-criando-interface-de-loading/references/deep-explanation.md) — Pending E fulfilled, inicializar true, impacto nos testes, skeleton screens
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-criando-interface-de-loading/references/code-examples.md) — State, extraReducers, Video loading, Header loading, skeleton sidebar
