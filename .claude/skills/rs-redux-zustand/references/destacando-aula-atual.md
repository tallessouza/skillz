---
name: rs-redux-zustand-destacando-aula-atual
description: "Applies conditional styling patterns using Redux selectors and HTML data attributes when highlighting active/selected items in React UI. Use when user asks to 'highlight active item', 'show current selection', 'style selected state', 'conditional styling with Redux', 'data attributes with Tailwind', or 'disabled active item'. Enforces data-attribute pattern over ternary className. Make sure to use this skill whenever styling UI elements based on Redux/Zustand store state. Not for form validation, API calls, or non-state-driven styling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: destacando-aula
  tags: [data-attributes, conditional-styling, tailwind, redux, active-state, disabled]
---

# Destacando Item Ativo com Data Attributes

> Derive visual state from store selectors, apply via data attributes, let Tailwind handle the rest.

## Rules

1. **Data attributes para styling condicional** — `data-active={isCurrent}` + `data-[active=true]:text-emerald-400`, porque elimina ternarios e escala melhor
2. **Desabilite item ativo** — `disabled={isCurrent}`, porque clicar no ativo nao faz sentido
3. **Hover apenas em habilitados** — `enabled:hover:text-zinc-300`
4. **Calcule `isCurrent` no pai** — passe como prop, porque o filho pode nao ter indice do modulo
5. **Troque icone por estado** — `PlayCircle` para ativo, `Video` para normal

## How to write

```tsx
<button
  data-active={isCurrent}
  disabled={isCurrent}
  className="text-zinc-400 data-[active=true]:text-emerald-400 enabled:hover:text-zinc-300"
>
  {isCurrent ? <PlayCircle className="text-emerald-400" /> : <Video />}
  <span>{title}</span>
</button>
```

## Example

**Before (ternario):** `className={isCurrent ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-300'}`
**After (data attribute):** `data-active={isCurrent}` + `data-[active=true]:text-emerald-400 enabled:hover:text-zinc-300`

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `className={isCurrent ? '...' : '...'}` | `data-active={isCurrent}` + `data-[active=true]:` |
| Hover em item disabled | `enabled:hover:` prefix |
| Click no item ativo | `disabled={isCurrent}` |

## Troubleshooting

### Hover aparece em item desabilitado
**Symptom:** Cursor muda e texto clareia no item ativo.
**Cause:** `hover:` aplica em todos os estados, incluindo disabled.
**Fix:** Use `enabled:hover:text-zinc-300` para restringir ao habilitado.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-destacando-aula-atual/references/deep-explanation.md) — Data attributes vs ternarios, selector derivado, disabled+enabled:hover
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-destacando-aula-atual/references/code-examples.md) — Header, Module com isCurrent, Lesson com data-active, variacao Zustand
