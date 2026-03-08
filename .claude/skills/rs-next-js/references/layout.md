---
name: rs-next-js-layout
description: "Applies shared layout pattern in Next.js Pages Router when creating page structures with header, main content, and footer. Use when user asks to 'create a layout', 'add header and footer', 'share components between pages', 'wrap pages in layout', or 'structure Next.js app'. Ensures layout goes in _app.tsx with children prop pattern. Make sure to use this skill whenever building Next.js Pages Router applications that need shared UI. Not for App Router layouts, CSS-only styling, or individual component creation."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: layout
  tags: [layout, pages-router, _app, children-prop, header, footer, next-js, barrel-export]
---

# Layout Pattern no Next.js Pages Router

> Crie um componente Layout que encapsula header, main e footer, e aplique-o no `_app.tsx` para compartilhar estrutura entre todas as páginas.

## Rules

1. **Layout recebe children como prop** — `children: React.ReactNode`, porque o conteúdo da página muda mas a casca permanece
2. **Layout vai no `_app.tsx`** — envolva o `<Component>` com `<Layout>`, porque `_app.tsx` é o wrapper de todas as páginas no Pages Router
3. **Header e Footer ficam DENTRO do Layout** — nunca importe header/footer diretamente nas páginas, porque duplica código e quebra consistência
4. **Main recebe o children** — a tag `<main>` é onde o conteúdo dinâmico da página é injetado
5. **Use barrel export no componente** — crie `index.ts` na pasta do componente para imports limpos, porque evita `layout/layout` no path

## How to write

### Componente Layout

```typescript
// components/Layout/Layout.tsx
import { Header } from '../Header'
import { Footer } from '../Footer'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative flex min-h-screen flex-col dark">
      <Header />
      <main className="flex flex-1 flex-col mb-12">
        {children}
      </main>
      <Footer />
    </div>
  )
}
```

### Barrel export

```typescript
// components/Layout/index.ts
export { Layout } from './Layout'
```

### Aplicar no _app.tsx

```typescript
// pages/_app.tsx
import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
```

## Example

**Before (header importado direto na página):**
```typescript
// pages/index.tsx
import { Header } from '../components/Header'

export default function Home() {
  return (
    <>
      <Header />
      <main>Conteúdo da home</main>
    </>
  )
}
```

**After (layout no _app.tsx, página só tem conteúdo):**
```typescript
// pages/index.tsx
export default function Home() {
  return <div>Conteúdo da home</div>
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Header/footer compartilhado entre páginas | Coloque no Layout, aplique no `_app.tsx` |
| Página precisa de layout diferente | Use per-page layout pattern com `getLayout` |
| Div wrapper do layout | Use `relative` se o header for fixo/sticky |
| Conteúdo principal | `<main>` com `flex-1` para ocupar espaço restante |

## Anti-patterns

| Nunca faça | Faça assim |
|------------|-----------|
| Importar Header em cada página | Colocar Header dentro do Layout |
| Layout sem children prop | `children: React.ReactNode` sempre |
| Colocar Layout dentro de cada página | Colocar Layout no `_app.tsx` |
| `import { Layout } from './Layout/Layout'` | `import { Layout } from './Layout'` (barrel) |
| Duplicar header no blog e na home | Um Layout compartilhado via `_app.tsx` |

## Troubleshooting

### Pagina 404 ao navegar para rota existente
**Symptom:** Rota existe no codigo mas retorna 404
**Cause:** Arquivo nao esta na estrutura correta do App Router (`app/{rota}/page.tsx`) ou Pages Router (`pages/{rota}.tsx`)
**Fix:** Verificar que o arquivo se chama exatamente `page.tsx` (App Router) ou que o export default existe (Pages Router). Reiniciar o servidor de desenvolvimento

### Layout nao aplica na rota filha
**Symptom:** Layout do diretorio pai nao envolve a pagina filha
**Cause:** Arquivo `layout.tsx` ausente ou nao retorna `{children}` no JSX
**Fix:** Garantir que o layout recebe e renderiza `children` como prop. Verificar que o layout esta no nivel correto da hierarquia de pastas

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-layout/references/deep-explanation.md) — O instrutor conecta diretamente com as aulas anteriores sobre arquivos especiais do Next.js. O `_app
- [code-examples.md](../../../data/skills/next-js/rs-next-js-layout/references/code-examples.md) — // components/Layout/Layout.tsx
