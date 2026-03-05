# Code Examples: Roteamento do Next.js (Pages Router)

## Exemplo 1: Rota raiz (index)

```typescript
// pages/index.tsx
// Acessivel em: /
export default function Home() {
  return <div>Hello World</div>
}
```

## Exemplo 2: Rota simples — Blog

```typescript
// pages/blog/index.tsx
// Acessivel em: /blog
export default function BlogPage() {
  return <div>Blog</div>
}
```

## Exemplo 3: Rota simples — About

```typescript
// pages/about/index.tsx
// Acessivel em: /about
export default function AboutPage() {
  return <div>About</div>
}
```

## Exemplo 4: Sub-rota (nested route)

```typescript
// pages/blog/user/index.tsx
// Acessivel em: /blog/user
export default function UserPage() {
  return <div>User</div>
}
```

Estrutura resultante:
```
pages/
└── blog/
    ├── index.tsx      → /blog
    └── user/
        └── index.tsx  → /blog/user
```

## Exemplo 5: Rota dinamica com [slug]

```typescript
// pages/blog/posts/[slug].tsx
// Acessivel em: /blog/posts/:slug (ex: /blog/posts/10)
import { useRouter } from 'next/router'

export default function Post() {
  const router = useRouter()
  const { slug } = router.query

  return <div>Post: {slug}</div>
}
```

Ao acessar `/blog/posts/10`:
- `router.query.slug` = `"10"` (string)

Ao acessar `/blog/posts/meu-artigo`:
- `router.query.slug` = `"meu-artigo"` (string)

## Exemplo 6: Catch-All com [...slug]

```typescript
// pages/blog/posts/[...slug].tsx
// Acessivel em: /blog/posts/* (qualquer quantidade de segmentos)
import { useRouter } from 'next/router'

export default function Post() {
  const router = useRouter()
  const segments = (router.query.slug as string[])?.join('/')

  return <div>{segments}</div>
}
```

Ao acessar `/blog/posts/20/10/30/40`:
- `router.query.slug` = `["20", "10", "30", "40"]` (array)
- `segments` = `"20/10/30/40"` (string unida com `/`)

## Estrutura completa do projeto da aula

```
pages/
├── index.tsx                  → /
├── about/
│   └── index.tsx              → /about
└── blog/
    ├── index.tsx              → /blog
    └── posts/
        ├── index.tsx          → /blog/posts
        └── [...slug].tsx      → /blog/posts/* (catch-all)
```

## Variacao: Rota dinamica sem catch-all

Se o arquivo fosse `[slug].tsx` (sem reticencias):

```typescript
// pages/blog/posts/[slug].tsx
// Acessivel APENAS em: /blog/posts/:slug (um unico segmento)
// /blog/posts/20      → funciona (slug = "20")
// /blog/posts/20/10   → 404! (dois segmentos, nao captura)
```

Com `[...slug].tsx`:
```typescript
// pages/blog/posts/[...slug].tsx
// /blog/posts/20      → funciona (slug = ["20"])
// /blog/posts/20/10   → funciona (slug = ["20", "10"])
// /blog/posts/a/b/c/d → funciona (slug = ["a", "b", "c", "d"])
```