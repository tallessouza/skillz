---
name: rs-next-js-componete-post-grid-card
description: "Applies responsive grid layout patterns when creating card grid components in Next.js or React. Use when user asks to 'create a grid', 'list cards', 'display posts in columns', 'responsive layout', or 'grid component'. Enforces mobile-first breakpoints, children prop typing, and consistent gap spacing. Make sure to use this skill whenever building any card listing or grid layout component. Not for single card styling, form layouts, or navigation components."
---

# PostGridCard — Grid Responsivo com Mobile First

> Ao criar componentes de grid para listagem, use mobile-first com breakpoints progressivos e receba conteudo via children tipado como ReactNode.

## Rules

1. **Mobile first sempre** — comece com `grid-cols-1` e escale para 2 e 3 colunas em breakpoints maiores, porque o layout mobile e o baseline e desktop e a excecao
2. **Children via props tipadas** — receba `children: React.ReactNode` em uma interface de props, porque o grid nao conhece o conteudo que renderiza
3. **Gap consistente** — use `gap-6` (24px) como espacamento padrao entre cards, porque mantem ritmo visual uniforme
4. **Componente separado para o grid** — nunca coloque logica de grid diretamente na pagina, porque isola responsabilidade de layout da responsabilidade de dados
5. **Espacamento entre secoes** — adicione padding entre header e grid (`pb-14` ~56px), porque separa visualmente as zonas de navegacao e conteudo

## How to write

### Grid component com children

```tsx
interface PostGridCardProps {
  children: React.ReactNode
}

export function PostGridCard({ children }: PostGridCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  )
}
```

### Uso na pagina

```tsx
import { PostGridCard } from './PostGridCard'
import { PostCard } from './PostCard'

export default function BlogList() {
  return (
    <>
      <header className="pb-14">
        {/* titulo, tags, search */}
      </header>
      <PostGridCard>
        <PostCard />
        <PostCard />
        <PostCard />
      </PostGridCard>
    </>
  )
}
```

## Example

**Before (grid direto na pagina):**
```tsx
export default function BlogList() {
  return (
    <div>
      <h1>Blog</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        <PostCard />
        <PostCard />
      </div>
    </div>
  )
}
```

**After (com PostGridCard):**
```tsx
export default function BlogList() {
  return (
    <div>
      <header className="pb-14">
        <h1>Blog</h1>
      </header>
      <PostGridCard>
        <PostCard />
        <PostCard />
      </PostGridCard>
    </div>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Listagem de cards qualquer | Extrair grid em componente separado |
| Mobile first | Comecar com 1 coluna, adicionar breakpoints |
| Breakpoints | `sm:grid-cols-2` para tablet, `lg:grid-cols-3` para desktop |
| Espacamento header-conteudo | `pb-14` no header (~56px) |
| Props do grid | Apenas `children: React.ReactNode` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `grid-cols-3` sem breakpoint mobile | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` |
| Grid inline na pagina com 3+ cards | Componente `PostGridCard` separado |
| `style={{ display: 'grid' }}` inline | Classes Tailwind no className |
| Props com array de posts no grid | `children` — grid nao conhece o dado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
