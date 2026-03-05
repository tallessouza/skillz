---
name: rs-redux-zustand-destacando-aula-atual
description: "Applies conditional styling patterns using Redux selectors and data attributes when building UI that highlights active/selected items. Use when user asks to 'highlight active item', 'show current selection', 'style selected state', 'conditional styling with Redux', or 'data attributes with Tailwind'. Enforces data-attribute pattern over ternary className concatenation. Make sure to use this skill whenever styling UI elements based on Redux/Zustand store state. Not for form validation, API calls, or non-state-driven styling."
---

# Destacando Item Ativo com Redux + Data Attributes

> Derive visual state from store selectors, apply it via data attributes, and let Tailwind handle the rest — no className ternaries.

## Rules

1. **Extraia dados derivados no selector** — retorne `currentModule` e `currentLesson` juntos do mesmo selector, porque evita re-renders desnecessarios e centraliza a logica de "qual item esta ativo"
2. **Use data attributes para styling condicional** — `data-active={isCurrent}` com `data-[active=true]:text-emerald-400`, porque elimina ternarios no className e escala melhor com multiplos estados
3. **Desabilite interacao no item ativo** — `disabled={isCurrent}`, porque clicar no item ja ativo nao faz sentido e previne dispatches desnecessarios
4. **Hover apenas em items habilitados** — `enabled:hover:text-zinc-300`, porque hover em item disabled confunde o usuario
5. **Calcule `isCurrent` no componente pai** — passe como prop para o filho, porque o filho pode nao ter acesso ao index do modulo

## How to write

### Selector que retorna modulo e aula ativos

```typescript
const { currentModule, currentLesson } = useAppSelector((state) => {
  const { currentModuleIndex, currentLessonIndex } = state.player

  const currentModule = state.player.course.modules[currentModuleIndex]
  const currentLesson = currentModule.lessons[currentLessonIndex]

  return { currentModule, currentLesson }
})
```

### Calculo de isCurrent no pai

```typescript
const { currentModuleIndex, currentLessonIndex } = useAppSelector((state) => ({
  currentModuleIndex: state.player.currentModuleIndex,
  currentLessonIndex: state.player.currentLessonIndex,
}))

const isCurrent =
  currentModuleIndex === moduleIndex && currentLessonIndex === lessonIndex
```

### Data attribute + Tailwind condicional

```tsx
<button
  data-active={isCurrent}
  disabled={isCurrent}
  className="flex items-center gap-3 text-sm text-zinc-400 data-[active=true]:text-emerald-400 enabled:hover:text-zinc-300"
  onClick={() => dispatch(play([moduleIndex, lessonIndex]))}
>
  {isCurrent ? (
    <PlayCircle className="w-4 h-4 text-emerald-400" />
  ) : (
    <Video className="w-4 h-4" />
  )}
  <span>{lesson.title}</span>
</button>
```

## Example

**Before (ternario no className):**
```tsx
<button
  className={`text-sm ${isCurrent ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-300'}`}
  onClick={() => dispatch(play([moduleIndex, lessonIndex]))}
>
  <Video className="w-4 h-4" />
  {lesson.title}
</button>
```

**After (data attribute pattern):**
```tsx
<button
  data-active={isCurrent}
  disabled={isCurrent}
  className="text-sm text-zinc-400 data-[active=true]:text-emerald-400 enabled:hover:text-zinc-300"
  onClick={() => dispatch(play([moduleIndex, lessonIndex]))}
>
  {isCurrent ? (
    <PlayCircle className="w-4 h-4 text-emerald-400" />
  ) : (
    <Video className="w-4 h-4" />
  )}
  {lesson.title}
</button>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Styling muda com base em estado do store | Data attribute + Tailwind `data-[attr=value]:` |
| Icone muda com base em estado | Ternario inline (`isCurrent ? <A /> : <B />`) |
| Item ativo nao deve ser clicavel | `disabled={isCurrent}` no button |
| Hover so faz sentido em items clicaveis | `enabled:hover:` prefix no Tailwind |
| Selector precisa de dados derivados | Calcule dentro do selector, retorne objeto |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `className={isCurrent ? 'text-green' : 'text-gray'}` | `data-active={isCurrent}` + `data-[active=true]:text-emerald-400` |
| Hover em item disabled | `enabled:hover:text-zinc-300` |
| Dois useAppSelector separados para module e lesson index | Um useAppSelector retornando ambos |
| `isCurrent` calculado dentro do componente filho sem acesso ao moduleIndex | Passar `isCurrent` como prop do pai |
| Permitir click no item ja ativo | `disabled={isCurrent}` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/redux-zustand/rs-redux-zustand-destacando-aula-atual/references/deep-explanation.md)
- [Code examples](../../../data/skills/redux-zustand/rs-redux-zustand-destacando-aula-atual/references/code-examples.md)
