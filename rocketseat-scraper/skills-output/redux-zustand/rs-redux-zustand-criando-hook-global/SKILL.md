---
name: rs-redux-zustand-criando-hook-global
description: "Enforces extraction of reusable selector hooks from Redux/Zustand stores when state selection logic is repeated across components. Use when user asks to 'create a selector', 'reuse store state', 'avoid repeated useSelector', 'create a custom hook for store', or 'share state logic between components'. Make sure to use this skill whenever detecting duplicated store selection patterns across multiple components. Not for creating stores, reducers, slices, or actions."
---

# Criando Hook Global de Seletor

> Extraia logica de selecao de estado repetida em um hook customizado exportado do proprio slice, eliminando duplicacao e centralizando acesso a dados derivados.

## Rules

1. **Identifique selecoes repetidas** — quando dois ou mais componentes fazem o mesmo `useSelector`/`useAppSelector` com a mesma logica de derivacao, extraia para um hook, porque codigo duplicado diverge silenciosamente com o tempo
2. **Exporte o hook do slice** — o hook customizado vive no mesmo arquivo do slice, nao em pasta separada de hooks, porque o hook depende da estrutura do estado daquele slice
3. **Nomeie pelo dado retornado, nao pela origem** — `useCurrentLesson` nao `usePlayerSliceData`, porque o consumidor se importa com o que recebe, nao de onde vem
4. **Retorne objeto nomeado** — retorne `{ currentModule, currentLesson }` nao valores posicionais, porque permite destructuring seletivo nos componentes
5. **Componentes consomem apenas o que precisam** — destructure somente os campos necessarios (`const { currentLesson } = useCurrentLesson()`), porque evita re-renders desnecessarios
6. **Mantenha o hook puro** — sem side effects dentro do hook, apenas selecao e derivacao de estado, porque side effects como `document.title` pertencem ao componente consumidor

## How to write

### Hook global no slice

```typescript
// player.ts (slice file)
export const useCurrentLesson = () => {
  return useAppSelector((state) => {
    const { currentModuleIndex, currentLessonIndex } = state.player
    const currentModule = state.player.course?.modules[currentModuleIndex]
    const currentLesson = currentModule?.lessons[currentLessonIndex]
    return { currentModule, currentLesson }
  })
}
```

### Componente consumindo o hook

```typescript
// Header.tsx — usa ambos
const { currentModule, currentLesson } = useCurrentLesson()

// Video.tsx — usa apenas lesson
const { currentLesson } = useCurrentLesson()
```

### Side effect no componente (nao no hook)

```typescript
// Player.tsx
const { currentLesson } = useCurrentLesson()

useEffect(() => {
  document.title = `Assistindo ${currentLesson?.title}`
}, [currentLesson])
```

## Example

**Before (selecao duplicada em cada componente):**

```typescript
// Header.tsx
const { currentModuleIndex, currentLessonIndex, course } = useAppSelector(
  (state) => state.player
)
const currentModule = course?.modules[currentModuleIndex]
const currentLesson = currentModule?.lessons[currentLessonIndex]

// Video.tsx (mesma logica copiada)
const { currentModuleIndex, currentLessonIndex, course } = useAppSelector(
  (state) => state.player
)
const currentModule = course?.modules[currentModuleIndex]
const currentLesson = currentModule?.lessons[currentLessonIndex]
```

**After (hook global extraido):**

```typescript
// Header.tsx
const { currentModule, currentLesson } = useCurrentLesson()

// Video.tsx
const { currentLesson } = useCurrentLesson()
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Mesma selecao em 2+ componentes | Extrair para hook no slice |
| Selecao usada em apenas 1 componente | Manter inline, nao extrair prematuramente |
| Hook precisa de parametro externo | Criar hook com argumento: `useLesson(lessonId)` |
| Dado derivado complexo (joins, filtros) | Hook e o lugar certo para centralizar |
| Side effect baseado no dado | Manter no componente com useEffect, nao no hook |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Hook de seletor em `hooks/useCurrentLesson.ts` separado do slice | Exportar do proprio arquivo do slice |
| `return [currentModule, currentLesson]` (array) | `return { currentModule, currentLesson }` (objeto) |
| `useEffect` dentro do hook de seletor | `useEffect` no componente consumidor |
| Copiar logica de selecao em cada componente | Chamar o hook compartilhado |
| `usePlayerData()` (nome generico) | `useCurrentLesson()` (nome pelo dado retornado) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
