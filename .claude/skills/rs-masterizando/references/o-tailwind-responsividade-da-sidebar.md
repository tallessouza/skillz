---
name: rs-tailwind-responsividade-sidebar
description: "Applies Tailwind mobile-first responsive sidebar patterns when building navigation sidebars, layouts, or responsive menus. Use when user asks to 'create a sidebar', 'make sidebar responsive', 'add mobile menu', 'fix sidebar on mobile', or 'implement responsive navigation'. Enforces mobile-first approach: base styles for mobile, lg: prefix for desktop. Make sure to use this skill whenever building sidebars or responsive layouts with Tailwind. Not for server-side rendering, JavaScript toggle logic, or non-Tailwind CSS frameworks."
---

# Responsividade de Sidebar com Tailwind

> Defina estilos base para mobile e use breakpoint prefixes para customizar em telas maiores — Tailwind e mobile-first.

## Rules

1. **Mobile-first sempre** — estilos sem prefixo aplicam para TODOS os tamanhos de tela, porque Tailwind usa min-width nos breakpoints
2. **Sidebar fixa no mobile** — use `fixed left-0 top-0 right-0 z-20` para sobrepor o conteudo, porque no mobile a sidebar deve cobrir a tela inteira
3. **Restaure no desktop com `lg:`** — use `lg:relative lg:w-80 lg:right-auto` para voltar ao layout normal, porque no desktop a sidebar vive ao lado do conteudo
4. **Padding menor no mobile** — use `p-4` base e `lg:px-5 lg:py-8` no desktop, porque telas pequenas precisam maximizar espaco util
5. **Borda direcional por breakpoint** — `border-b` no mobile (divisao horizontal) e `lg:border-r lg:border-b-0` no desktop (divisao vertical), porque a sidebar muda de orientacao visual
6. **`bottom-0` para altura total** — combine `top-0 bottom-0` para sidebar ocupar 100% da altura no mobile sem precisar de `h-screen`

## How to write

### Sidebar responsiva (aside element)

```tsx
<aside className="
  fixed bottom-0 left-0 right-0 top-0 z-20
  border-b bg-white p-4
  lg:relative lg:right-auto lg:w-80
  lg:border-b-0 lg:border-r
  lg:px-5 lg:py-8
">
  {/* sidebar content */}
</aside>
```

### Breakpoint mental model

```
// SEM prefixo = mobile (todos os tamanhos)
// lg: = 1024px+
// xl: = 1280px+

// Tailwind gera:
// .fixed { position: fixed; }                    ← sempre
// @media (min-width: 1024px) { .lg\:relative { position: relative; } }  ← sobrescreve
```

## Example

**Before (sem responsividade):**
```tsx
<aside className="flex w-80 flex-col gap-6 border-r px-5 py-8">
```

**After (mobile-first responsivo):**
```tsx
<aside className="
  fixed bottom-0 left-0 right-0 top-0 z-20
  flex flex-col gap-6 border-b bg-white p-4
  lg:relative lg:right-auto lg:w-80
  lg:border-b-0 lg:border-r lg:px-5 lg:py-8
">
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Sidebar deve sobrepor conteudo no mobile | `fixed inset-0 z-20` + `lg:relative` |
| Propriedade so faz sentido no desktop | Adicione prefixo `lg:` |
| Propriedade so faz sentido no mobile | Defina base + sobrescreva com `lg:` (nao existe prefixo "mobile-only") |
| Precisa testar responsividade | DevTools → toggle device → escolha dispositivo (ex: iPhone SE 375px) |
| Largura fixa so no desktop | `lg:w-80` sem `w-*` base (mobile usa `right-0 left-0` para full-width) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `w-80` sem breakpoint (quebra mobile) | `lg:w-80` (largura fixa so no desktop) |
| `hidden lg:flex` para sidebar (perde conteudo) | `fixed ... lg:relative` (muda posicionamento) |
| `h-screen` para altura total no fixed | `top-0 bottom-0` (mais robusto com fixed) |
| `md:` para sidebar (muito cedo) | `lg:` (sidebar precisa de espaco, 1024px+) |
| Estilos desktop sem prefixo + mobile com hack | Base = mobile, prefixo = desktop (mobile-first) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/masterizando/rs-masterizando-o-tailwind-responsividade-da-sidebar/references/deep-explanation.md)
- [Code examples](../../../data/skills/masterizando/rs-masterizando-o-tailwind-responsividade-da-sidebar/references/code-examples.md)
