---
name: rs-next-js-roteamento-pages-router
description: "Applies Next.js Pages Router file-based routing patterns when creating routes, pages, or navigation. Use when user asks to 'create a page', 'add a route', 'setup routing', 'dynamic route', 'catch-all route', or any Next.js Pages Router task. Enforces file-based routing conventions: index.tsx as route entry, bracket syntax for dynamic segments, spread syntax for catch-all. Make sure to use this skill whenever working with Next.js Pages Router routing. Not for App Router, API routes, or middleware configuration."
---

# Roteamento do Next.js (Pages Router)

> Cada arquivo dentro de `pages/` vira automaticamente uma rota no browser — a estrutura de pastas E a estrutura de URLs.

## Rules

1. **Arquivo = Rota** — cada arquivo `.tsx` dentro de `pages/` corresponde a uma rota no browser, porque o Next resolve rotas pelo filesystem, sem configuracao manual
2. **`index.tsx` e a raiz do segmento** — `pages/index.tsx` = `/`, `pages/blog/index.tsx` = `/blog`, porque o index sempre representa a entrada daquele nivel
3. **Sub-rotas sao subpastas** — `pages/blog/posts/index.tsx` = `/blog/posts`, porque a hierarquia de pastas espelha a hierarquia de URLs
4. **Colchetes para rotas dinamicas** — `[slug].tsx` captura um segmento dinamico acessivel via `router.query.slug`, porque o Next usa a convencao de colchetes para parametros
5. **Reticencias para catch-all** — `[...slug].tsx` captura multiplos segmentos como array de strings, porque os tres pontos indicam "todos os segmentos restantes"
6. **Pagina e um componente React** — toda rota exporta um componente React como default export, porque o Next renderiza esse componente ao acessar a rota

## How to write

### Rota simples (estatica)

```
pages/
├── index.tsx          → /
├── blog/
│   └── index.tsx      → /blog
└── about/
    └── index.tsx      → /about
```

```typescript
// pages/blog/index.tsx
export default function BlogPage() {
  return <div>Blog</div>
}
```

### Sub-rotas (nested)

```
pages/
└── blog/
    ├── index.tsx          → /blog
    └── posts/
        └── index.tsx      → /blog/posts
```

### Rota dinamica

```
pages/
└── blog/
    └── posts/
        ├── index.tsx      → /blog/posts
        └── [slug].tsx     → /blog/posts/:slug
```

```typescript
// pages/blog/posts/[slug].tsx
import { useRouter } from 'next/router'

export default function Post() {
  const router = useRouter()
  const { slug } = router.query

  return <div>Post: {slug}</div>
}
```

### Catch-All segments

```
pages/
└── blog/
    └── posts/
        └── [...slug].tsx  → /blog/posts/*
```

```typescript
// pages/blog/posts/[...slug].tsx
import { useRouter } from 'next/router'

export default function Post() {
  const router = useRouter()
  const segments = (router.query.slug as string[])?.join('/')

  return <div>{segments}</div>
}
// /blog/posts/20/10/30 → slug = ["20", "10", "30"] → "20/10/30"
```

## Example

**Before (React Router DOM — configuracao manual):**
```typescript
// Precisa configurar manualmente cada rota
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/posts/:slug" element={<Post />} />
  </Routes>
</BrowserRouter>
```

**After (Next.js Pages Router — file-based):**
```
pages/
├── index.tsx              → /
├── blog/
│   ├── index.tsx          → /blog
│   └── posts/
│       ├── index.tsx      → /blog/posts
│       └── [slug].tsx     → /blog/posts/:slug
```
Sem configuracao. Criar o arquivo = criar a rota.

## Heuristics

| Situation | Do |
|-----------|-----|
| Rota fixa como `/about`, `/blog` | Criar pasta com `index.tsx` |
| Parametro na URL como `/posts/123` | Usar `[param].tsx` com colchetes |
| Multiplos segmentos variaveis | Usar `[...param].tsx` (catch-all) |
| Rota raiz `/` | `pages/index.tsx` |
| Acessar parametro dinamico | `useRouter().query.param` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Configurar rotas manualmente com React Router dentro do Next | Criar arquivos em `pages/` |
| `pages/blog.tsx` para rota com sub-rotas | `pages/blog/index.tsx` (pasta permite sub-rotas futuras) |
| Hardcodar IDs em nomes de arquivo | `[id].tsx` para rotas dinamicas |
| Tentar capturar multiplos segmentos com `[slug].tsx` | `[...slug].tsx` para catch-all |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
