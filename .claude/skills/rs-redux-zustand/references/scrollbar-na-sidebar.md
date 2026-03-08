---
name: rs-redux-zustand-scrollbar-na-sidebar
description: "Applies sidebar scrollbar styling with tailwind-scrollbar plugin and absolute positioning when building height-constrained sidebars. Use when user asks to 'add scrollbar to sidebar', 'style scrollbar with tailwind', 'fix sidebar height', 'sidebar overflow scroll', or 'limit sidebar to player height'. Ensures correct absolute positioning for height-constrained sidebars. Make sure to use this skill whenever implementing scrollable sidebars in Tailwind CSS projects. Not for general overflow handling, native browser scrollbar styling, or non-Tailwind projects."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: scrollbar-sidebar
  tags: [tailwind, scrollbar, sidebar, overflow, position-absolute, tailwind-scrollbar]
---

# Scrollbar na Sidebar

> Quando a sidebar precisa ter altura limitada por outro elemento, use position absolute com referencia no container pai.

## Rules

1. **Position absolute para limitar altura** — `absolute top-0 bottom-0 right-0` com `relative` no pai, porque `overflow-y` sozinho nao funciona quando altura e definida pelo conteudo
2. **Compense com padding** — `pr-80` no container pai, porque absolute remove do fluxo
3. **tailwind-scrollbar para estilizar** — `scrollbar scrollbar-thin scrollbar-track-{cor} scrollbar-thumb-{cor}`
4. **divide para separar modulos** — `divide-y-2 divide-zinc-900`

## How to write

```tsx
<main className="relative flex pr-80">
  <div className="flex-1">{/* player */}</div>
  <aside className="absolute top-0 bottom-0 right-0 w-80 overflow-y-auto
    scrollbar scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-800">
    <div className="divide-y-2 divide-zinc-900">{/* modules */}</div>
  </aside>
</main>
```

## Example

**Before:** `overflow-y-auto` sem limitar altura — sidebar cresce infinitamente
**After:** `absolute top-0 bottom-0` + `overflow-y-auto` — sidebar limitada ao player

## Troubleshooting

### Scroll nao aparece na sidebar
**Symptom:** Sidebar cresce com conteudo, scroll nunca ativa.
**Cause:** Container sem altura limitada — `overflow-y` nao tem referencia.
**Fix:** Use `absolute top-0 bottom-0 right-0` com `relative` no pai e `pr-80` para compensar.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-scrollbar-na-sidebar/references/deep-explanation.md) — Por que overflow sozinho nao funciona, position absolute, tailwind-scrollbar, divide
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-scrollbar-na-sidebar/references/code-examples.md) — Instalacao, configuracao, estrutura HTML completa, variacoes de cores
