---
name: rs-next-js-ssg-isr-app-router
description: "Applies Static Site Generation (SSG) and Incremental Static Regeneration (ISR) patterns when building Next.js App Router pages. Use when user asks to 'generate static params', 'pre-render dynamic routes', 'revalidate pages', 'cache static pages', or 'convert server-side to static'. Enforces generateStaticParams, revalidate export, and dynamicParams conventions. Make sure to use this skill whenever creating dynamic routes in Next.js App Router that need static generation or periodic revalidation. Not for Pages Router, client components, or API routes."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: app-router-fundamentos
  tags: [ssg, isr, generateStaticParams, revalidate, dynamicParams, static-generation, next-js]
---

# SSG e ISR na App Router do Next.js

> Rotas dinamicas no App Router usam `generateStaticParams` para gerar paginas estaticas em build e `revalidate` para invalidar cache periodicamente sem rebuild completo.

## Rules

1. **Use `generateStaticParams` para pre-renderizar rotas dinamicas** — retorne um array de objetos com os parametros da rota, porque o Next precisa saber quais paginas gerar em build time
2. **O nome do parametro deve coincidir com o nome da pasta dinamica** — se a pasta e `[slug]`, retorne `{ slug: value }`, nao `{ paths: value }`, porque o Next faz matching por nome exato
3. **Exporte `revalidate` como constante numerica para ISR** — `export const revalidate = 60` faz o Next invalidar o cache a cada 60 segundos sem rebuild completo
4. **Exporte `dynamicParams` para controlar rotas nao-geradas** — `true` (default) tenta gerar sob demanda, `false` retorna 404 para qualquer rota nao gerada em build
5. **Nomes de funcoes e constantes exportadas sao convencoes do Next** — `generateStaticParams` (nao `generateStaticPaths`), `revalidate` (nao `revalidateTime`), porque o Next reconhece apenas os nomes exatos

## How to write

### generateStaticParams para rotas dinamicas

```typescript
// app/blog/[slug]/page.tsx
import { allPosts } from 'contentlayer/generated'

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = allPosts.find((p) => p.slug === params.slug)
  return <article>{post?.body.html}</article>
}
```

### ISR com revalidate

```typescript
// app/blog/[slug]/page.tsx
export const revalidate = 60 // revalida a cada 60 segundos

export async function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }))
}
```

### Controle de rotas nao-geradas com dynamicParams

```typescript
// dynamicParams = true (default): tenta gerar paginas sob demanda
// dynamicParams = false: retorna 404 para rotas nao geradas em build
export const dynamicParams = false
```

## Example

**Before (server-side apenas, sem geracao estatica):**
```typescript
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = allPosts.find((p) => p.slug === params.slug)
  return <article>{post?.title}</article>
}
// Funciona, mas e server-rendered a cada request
```

**After (SSG + ISR aplicados):**
```typescript
// app/blog/[slug]/page.tsx
export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = allPosts.find((p) => p.slug === params.slug)
  return <article>{post?.title}</article>
}
// Paginas geradas em build, revalidadas a cada 60s, novas rotas geradas sob demanda
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Conteudo que muda raramente (blog, docs) | `generateStaticParams` + `revalidate` alto (3600+) |
| Conteudo que muda com frequencia | `revalidate` baixo (60-300) |
| Conjunto fixo de paginas, sem novas | `dynamicParams = false` |
| Novas paginas podem surgir apos build | `dynamicParams = true` (default) |
| Migrando de Pages Router `getStaticPaths` | Substitua por `generateStaticParams` |
| Migrando `getStaticProps` com `revalidate` | Exporte `const revalidate = N` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `generateStaticPaths` | `generateStaticParams` (nome correto no App Router) |
| `return { paths: [...], fallback: true }` | `return posts.map(p => ({ slug: p.slug }))` |
| `{ params: { paths: post.slug } }` | `{ slug: post.slug }` (match com nome da pasta `[slug]`) |
| `export const revalidate = true` | `export const revalidate = 60` (deve ser numero em segundos) |
| `getStaticProps` no App Router | Exporte `revalidate` como constante |

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

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-entendendo-ssg-e-isr-na-app-router/references/deep-explanation.md) — No Pages Router, a geracao estatica usava duas funcoes separadas:
- [code-examples.md](../../../data/skills/next-js/rs-next-js-entendendo-ssg-e-isr-na-app-router/references/code-examples.md) — Estrutura de pastas:
