---
name: rs-nextjs-app-router-grupos-rotas-dinamicas
description: "Applies Next.js App Router route groups and dynamic routes patterns when structuring pages. Use when user asks to 'create a route', 'add a page', 'setup routing', 'dynamic params', 'group pages', or 'share layout between pages'. Enforces parentheses for route groups, brackets for dynamic segments, and spread syntax for catch-all routes. Make sure to use this skill whenever creating or modifying Next.js App Router file structure. Not for API routes, middleware, or server actions."
---

# Grupos e Rotas Dinamicas no Next.js App Router

> Estruture pastas com parenteses para agrupar sem afetar a URL, colchetes para parametros dinamicos, e reticencias para catch-all routes.

## Rules

1. **Use parenteses para grupos de rotas** — `(auth)/sign-in/page.tsx` nao `auth/sign-in/page.tsx`, porque parenteses criam agrupamento logico sem adicionar segmento na URL
2. **Use colchetes para rotas dinamicas** — `[id]/page.tsx` nao `id/page.tsx`, porque colchetes indicam parametro dinamico ao Next.js
3. **Use reticencias para catch-all** — `[...data]/page.tsx` quando a rota aceita numero indeterminado de segmentos, porque captura todos os segmentos restantes num array
4. **Params sao sempre strings** — converta explicitamente quando precisar de number ou outro tipo, porque a URL so transmite strings
5. **Layout dentro do grupo e compartilhado** — coloque `layout.tsx` dentro da pasta com parenteses para compartilhar entre todas as paginas do grupo, porque o Next.js herda layouts por hierarquia de pastas
6. **Nomeie parametros semanticamente** — `[slug]` ou `[id]`, nao `[param]`, porque o nome vira a chave no objeto params

## How to write

### Route Group (layout compartilhado sem afetar URL)

```
app/
├── (auth)/
│   ├── layout.tsx        # Layout compartilhado entre sign-in e sign-up
│   ├── sign-in/
│   │   └── page.tsx      # Acessivel em /sign-in (sem /auth na URL)
│   └── sign-up/
│       └── page.tsx      # Acessivel em /sign-up
```

```tsx
// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1 className="text-xl font-bold">Logo do App</h1>
      {children}
    </div>
  )
}
```

### Dynamic Route (parametro unico)

```
app/
├── catalog/
│   └── product/
│       └── [id]/
│           └── page.tsx  # Acessivel em /catalog/product/123
```

```tsx
// app/catalog/product/[id]/page.tsx
interface ProductProps {
  params: Promise<{ id: string }>
}

export default async function Product({ params }: ProductProps) {
  const { id } = await params
  return <h1>Product: {id}</h1>
}
```

### Catch-All Route (multiplos parametros)

```
app/
├── catalog/
│   └── product/
│       └── [...data]/
│           └── page.tsx  # Acessivel em /catalog/product/3/s/blue
```

```tsx
// app/catalog/product/[...data]/page.tsx
interface ProductProps {
  params: Promise<{ data: string[] }>
}

export default async function Product({ params }: ProductProps) {
  const { data } = await params
  const [productId, size, color] = data
  return (
    <div>
      <p>Product: {productId}</p>
      <p>Size: {size}</p>
      <p>Color: {color}</p>
    </div>
  )
}
```

## Example

**Before (grupo como segmento real na URL):**
```
app/
├── auth/
│   ├── layout.tsx
│   ├── sign-in/page.tsx   # URL: /auth/sign-in ❌
│   └── sign-up/page.tsx   # URL: /auth/sign-up ❌
```

**After (grupo invisivel na URL):**
```
app/
├── (auth)/
│   ├── layout.tsx
│   ├── sign-in/page.tsx   # URL: /sign-in ✓
│   └── sign-up/page.tsx   # URL: /sign-up ✓
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Paginas que compartilham layout mas nao segmento de URL | Route group com parenteses |
| Pagina que exibe detalhe de um item | Rota dinamica com `[id]` ou `[slug]` |
| Rota que aceita numero variavel de segmentos | Catch-all com `[...param]` |
| Precisa do parametro como numero | `const id = Number(params.id)` apos receber |
| Layout exclusivo de um grupo de paginas | `layout.tsx` dentro da pasta do grupo |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `app/auth/sign-in/page.tsx` (quando auth nao deve aparecer na URL) | `app/(auth)/sign-in/page.tsx` |
| `app/product/page.tsx` com query string para ID | `app/product/[id]/page.tsx` com parametro na rota |
| `[param]` como nome generico | `[id]`, `[slug]`, `[category]` — nome semantico |
| `params.id` usado direto como number sem conversao | `Number(params.id)` ou `parseInt(params.id, 10)` |
| Multiplas pastas dinamicas aninhadas para dados relacionados | `[...data]` catch-all quando os segmentos formam um conjunto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-app-router-e-testes-grupos-e-rotas-dinamicas/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-app-router-e-testes-grupos-e-rotas-dinamicas/references/code-examples.md)
