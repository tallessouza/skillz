---
name: rs-redux-zustand-criando-hook-global
description: "Enforces extraction of reusable selector hooks from Redux/Zustand stores when state selection logic is repeated across components. Use when user asks to 'create a selector hook', 'reuse store state logic', 'avoid repeated useSelector', 'create custom hook for store', 'share derived state between components', or 'extract selector hook'. Make sure to use this skill whenever detecting duplicated store selection patterns across multiple components. Not for creating stores, reducers, slices, actions, or side effects."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: criando-hook-global
  tags: [custom-hook, selector, reuse, derived-state, redux, zustand]
---

# Criando Hook Global de Seletor

> Extraia logica de selecao repetida em um hook customizado exportado do slice, eliminando duplicacao.

## Rules

1. **Identifique selecoes repetidas** — 2+ componentes com mesma logica de derivacao, extraia para hook
2. **Exporte do slice** — hook vive no arquivo do slice, porque depende da estrutura do estado
3. **Nomeie pelo dado retornado** — `useCurrentLesson` nao `usePlayerSliceData`
4. **Retorne objeto nomeado** — `return { currentModule, currentLesson }` para destructuring seletivo
5. **Hook puro** — sem side effects; useEffect pertence ao componente consumidor

## How to write

```typescript
// player.ts (arquivo do slice)
export const useCurrentLesson = () => {
  return useAppSelector((state) => {
    const { currentModuleIndex, currentLessonIndex } = state.player
    const currentModule = state.player.course?.modules[currentModuleIndex]
    const currentLesson = currentModule?.lessons[currentLessonIndex]
    return { currentModule, currentLesson }
  })
}

// Header.tsx
const { currentModule, currentLesson } = useCurrentLesson()

// Video.tsx — usa apenas lesson
const { currentLesson } = useCurrentLesson()
```

## Example

**Before (duplicado):** Mesma logica de selector em Header.tsx e Video.tsx
**After (hook):** `useCurrentLesson()` em ambos, logica centralizada no slice

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Hook em `hooks/useCurrentLesson.ts` | Exportar do arquivo do slice |
| `return [a, b]` (array) | `return { a, b }` (objeto) |
| `useEffect` dentro do hook | `useEffect` no componente |

## Troubleshooting

### Hook re-renderiza componentes que nao usam todos os campos
**Symptom:** Video re-renderiza quando currentModule muda, mesmo usando so currentLesson.
**Cause:** O selector retorna novo objeto a cada mudanca de qualquer campo.
**Fix:** Para otimizacao extrema, crie selectors separados. Para a maioria dos casos, o overhead e negligivel.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-criando-hook-global/references/deep-explanation.md) — Seletores como API publica, co-localizacao, destructuring seletivo
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-criando-hook-global/references/code-examples.md) — Slice com hook, Header, Video, Player com side effect
