---
name: rs-next-js-iniciando-a-home
description: "Applies Next.js home page scaffolding patterns when setting up initial page layout with fonts, Tailwind classes, and component structure. Use when user asks to 'create a home page', 'setup Next.js layout', 'configure fonts in Next.js', 'start a new page', or 'scaffold initial page structure'. Ensures correct Inter font configuration, semantic HTML structure, and Tailwind utility patterns. Make sure to use this skill whenever creating initial Next.js pages or configuring custom fonts. Not for API routes, database setup, or backend logic."
---

# Iniciando a Home — Next.js Page Scaffolding

> Configure fontes, estruture o layout inicial e aplique Tailwind utilities seguindo o padrao do Next.js App Router.

## Rules

1. **Configure fontes no layout root** — importe fontes do `next/font/google` no `layout.tsx`, nunca em componentes individuais, porque fontes devem ser consistentes em toda a aplicacao
2. **Especifique apenas os pesos necessarios** — declare somente `400`, `500`, `700` (ou os que o design exige), porque pesos extras aumentam o bundle sem necessidade
3. **Use `font.variable` no className do body** — aplique a CSS variable da fonte no elemento raiz, porque isso permite que Tailwind acesse a fonte via `font-family`
4. **Estruture com divs semanticas de agrupamento** — agrupe titulo + descricao em uma div, e use outra div com `flex items-center justify-between` para alinhar com futuros componentes (como date pickers), porque a estrutura responsiva precisa existir antes do conteudo
5. **Aplique classes utilitarias com prefixo responsivo** — use `md:mb-8` para espacamentos que mudam em telas medias, porque mobile-first e o padrao do Tailwind
6. **Separe fontes decorativas em variaveis proprias** — se o design usa uma segunda fonte (ex: display/tight), configure-a como variavel separada no layout, porque misturar fontes em uma unica config gera conflitos

## How to write

### Configuracao de fonte no layout.tsx

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  )
}
```

### Estrutura basica da home page

```typescript
export default function Home() {
  return (
    <div className="bg-background-primary p-6">
      <div className="flex items-center justify-between md:mb-8">
        <div>
          <h1 className="text-title text-content mb-2">Sua agenda</h1>
          <p className="text-paragraph-small text-content-secondary">
            Aqui você pode ver todos os clientes e serviços agendados para hoje
          </p>
        </div>
        {/* Date picker vai aqui */}
      </div>
    </div>
  )
}
```

## Example

**Before (setup padrao do Next.js):**
```typescript
import { Geist, Geist_Mono } from 'next/font/google'

const geist = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

// page.tsx
export default function Home() {
  return <h2>Hello World</h2>
}
```

**After (com esta skill aplicada):**
```typescript
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

// page.tsx
export default function Home() {
  return (
    <div className="bg-background-primary p-6">
      <div className="flex items-center justify-between md:mb-8">
        <div>
          <h1 className="text-title text-content mb-2">Sua agenda</h1>
          <p className="text-paragraph-small text-content-secondary">
            Aqui você pode ver todos os clientes e serviços agendados
          </p>
        </div>
      </div>
    </div>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo Next.js com fontes default | Substitua pela fonte do design (ex: Inter) com pesos especificos |
| Pagina precisa de titulo + acao lateral | Use `flex items-center justify-between` no container pai |
| Design tem fonte decorativa extra | Configure como segunda variavel CSS no layout |
| Metadata do projeto (title/description) | Extraia do Figma/design e configure no `metadata` export do layout |
| Espacamento responsivo | Use prefixo `md:` para breakpoints medios |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Importar fonte em cada componente | Importar uma vez no `layout.tsx` raiz |
| `subsets: ['latin']` sem `weight` | Sempre especificar os pesos usados no design |
| `<h1>` solto sem container de agrupamento | Agrupar titulo + descricao em div semantica |
| Estilos inline para layout | Usar Tailwind utilities (`flex`, `items-center`, `justify-between`) |
| Deixar fontes do starter template | Substituir pelas fontes reais do projeto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
