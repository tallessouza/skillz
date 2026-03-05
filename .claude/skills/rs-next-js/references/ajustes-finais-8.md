---
name: rs-next-js-ajustes-finais-8
description: "Applies Next.js layout polishing patterns when finalizing a project for deploy. Use when user asks to 'add a header', 'fix layout width', 'limit max-width', 'add glassmorphism header', 'prepare for deploy', or 'final adjustments'. Enforces fixed header with backdrop blur, max-width container for desktop, and mobile-first responsive structure. Make sure to use this skill whenever building layout shells or headers in Next.js with Tailwind. Not for API routes, data fetching, or authentication logic."
---

# Ajustes Finais — Layout e Header Next.js

> Antes do deploy, garanta que o layout tem header fixo com efeito glassmorphism, container com max-width para desktop, e estrutura semantica com main.

## Rules

1. **Header fixo no topo** — use `fixed top-0 z-50 w-full` porque o header deve permanecer visivel durante scroll
2. **Glassmorphism no header** — use `bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60` em vez de cor solida, porque o efeito de vidro e mais elegante e moderno
3. **Limite de largura no desktop** — sempre defina `max-w-3xl mx-auto` (768px) no container principal, porque mobile-first sem max-width quebra em telas grandes
4. **Tag main semantica** — envolva o conteudo em `<main>` com `flex flex-1 flex-col mt-12`, porque margin-top compensa o header fixo e a semantica melhora acessibilidade
5. **Header no layout, nao na page** — coloque o header no `layout.tsx` acima do `<main>`, porque ele aparece em todas as paginas
6. **Logo como componente separado** — extraia a logo com link para home em componente proprio, porque facilita reutilizacao e mantem o header limpo

## How to write

### Header com glassmorphism

```tsx
// components/header/header.tsx
export const Header = () => {
  return (
    <header className="fixed top-0 z-50 w-full bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-3xl mx-auto px-4">
        <Logo />
      </div>
    </header>
  )
}
```

### Logo com link para home

```tsx
// components/logo/logo.tsx
import Link from "next/link"
import { Dog } from "lucide-react"

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-4 bg-background/95 w-fit p-3 rounded-b-lg">
      <div className="w-8 h-8 bg-background-brand rounded flex items-center justify-center">
        <Dog />
      </div>
      <span className="text-label-lg font-bold text-content-brand">
        MundoPet
      </span>
    </Link>
  )
}
```

### Layout com max-width

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        <main className="flex flex-1 flex-col mt-12 max-w-3xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  )
}
```

## Example

**Before (sem limite de largura, sem header):**
```tsx
// layout.tsx — conteudo ocupa 100% da tela no desktop
<body>
  {children}
</body>
```

**After (com header fixo e container limitado):**
```tsx
<body>
  <Header />
  <main className="flex flex-1 flex-col mt-12 max-w-3xl mx-auto">
    {children}
  </main>
</body>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto mobile-first indo pra desktop | Adicione `max-w-3xl mx-auto` no container |
| Header com cor solida | Troque por `backdrop-blur` + opacidade para efeito vidro |
| Conteudo sobreposto pelo header fixo | Adicione `mt-12` (ou valor equivalente a altura do header) no main |
| Logo precisa linkar pra home | Use `Link` do Next.js com `href="/"` |
| Barrel exports de componentes | Crie `index.ts` com `export * from "./component"` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `bg-primary` solido no header | `bg-background/60 backdrop-blur` para glassmorphism |
| Conteudo sem max-width no desktop | `max-w-3xl mx-auto` no container principal |
| Header dentro de `page.tsx` | Header no `layout.tsx` (compartilhado entre paginas) |
| Body sem tag `<main>` semantica | Envolva conteudo em `<main>` com flex |
| Copiar e colar sem revisar textos | Revise labels apos duplicar componentes (ex: "manha" em vez de "noite") |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-ajustes-finais-8/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-ajustes-finais-8/references/code-examples.md)
