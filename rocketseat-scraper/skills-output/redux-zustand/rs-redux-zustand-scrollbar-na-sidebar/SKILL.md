---
name: rs-redux-zustand-scrollbar-sidebar
description: "Applies sidebar scrollbar styling with tailwind-scrollbar plugin and CSS positioning techniques. Use when user asks to 'add scrollbar to sidebar', 'style scrollbar', 'fix sidebar height', 'sidebar overflow', or 'limit sidebar to player height'. Ensures correct absolute positioning pattern for height-constrained sidebars and tailwind-scrollbar classes. Make sure to use this skill whenever implementing scrollable sidebars in Tailwind CSS projects. Not for general overflow handling, native browser scrollbar, or non-Tailwind projects."
---

# Scrollbar na Sidebar

> Quando a sidebar precisa ter altura limitada por outro elemento, use position absolute com referencia no container pai e estilize a scrollbar com tailwind-scrollbar.

## Rules

1. **Use position absolute para limitar altura da sidebar** — `absolute top-0 bottom-0 right-0` com `relative` no pai, porque `overflow-y` sozinho nao funciona quando a altura do container e definida pelo conteudo
2. **Compense o espaco da sidebar com padding** — adicione `pr-80` (ou largura equivalente) no container pai, porque position absolute remove o elemento do fluxo normal
3. **Use tailwind-scrollbar para estilizar** — `scrollbar scrollbar-thin scrollbar-track-{cor} scrollbar-thumb-{cor}`, porque a scrollbar nativa do navegador e visualmente inconsistente
4. **Separe modulos com divide** — `divide-y-2 divide-zinc-900` no container dos modulos, porque sem separacao visual modulos colapsados ficam grudados

## How to write

### Container pai (referencia de altura)

```tsx
<main className="relative flex pr-80">
  {/* Player ocupa o espaco menos o padding */}
  <div className="flex-1">{/* player content */}</div>
  
  <aside className="absolute top-0 bottom-0 right-0 w-80 overflow-y-auto
    scrollbar scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-800">
    <div className="divide-y-2 divide-zinc-900">
      {/* modules */}
    </div>
  </aside>
</main>
```

### Setup do plugin

```js
// tailwind.config.js
module.exports = {
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
```

## Example

**Before (scrollbar nao funciona):**

```tsx
<main className="flex">
  <div className="flex-1">{/* player */}</div>
  <aside className="w-80 overflow-y-auto">
    {/* sidebar cresce infinitamente com o conteudo */}
  </aside>
</main>
```

**After (sidebar limitada ao player):**

```tsx
<main className="relative flex pr-80">
  <div className="flex-1">{/* player */}</div>
  <aside className="absolute top-0 bottom-0 right-0 w-80 overflow-y-auto
    scrollbar scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-800">
    <div className="divide-y-2 divide-zinc-900">
      {/* modules com separacao visual */}
    </div>
  </aside>
</main>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Sidebar deve acompanhar altura de elemento irmao | Position absolute + relative no pai |
| Scrollbar nativa feia | tailwind-scrollbar plugin |
| Modulos colapsaveis sem separacao | `divide-y-2 divide-{cor}` |
| Elemento com position absolute sobrepoe irmao | Padding no pai igual a largura do elemento |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `overflow-y-auto` sem limitar altura | `absolute top-0 bottom-0` + `overflow-y-auto` |
| Scrollbar nativa sem estilizacao | `scrollbar scrollbar-thin scrollbar-track-* scrollbar-thumb-*` |
| Modulos sem separacao visual | `divide-y-2 divide-zinc-900` |
| Position absolute sem compensar espaco | `pr-80` no container pai |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
