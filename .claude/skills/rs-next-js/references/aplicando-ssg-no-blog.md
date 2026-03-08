---
name: rs-next-js-aplicando-ssg-no-blog
description: "Applies getStaticProps pattern for static data fetching in Next.js Pages Router when user asks to 'create a blog page', 'list posts statically', 'use getStaticProps', 'fetch data at build time', or 'optimize static content delivery'. Enforces correct SSG data flow: fetch in getStaticProps, sort server-side, type props, pass to component. Make sure to use this skill whenever implementing static pages with Pages Router. Not for App Router, server components, dynamic routes with getStaticPaths, or API routes."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: static-site-generation
  tags: [SSG, getStaticProps, pages-router, blog, static-generation, build-time]
---

# Aplicando SSG no Blog (Pages Router)

> Busque e prepare dados no servidor com `getStaticProps`, nunca no componente — o componente apenas recebe props tipadas.

## Rules

1. **Use `getStaticProps` para conteudo estatico** — blogs, listagens, landing pages, porque o conteudo e gerado uma unica vez no build e servido como HTML puro
2. **Ordene e filtre no servidor** — faca sort/filter dentro de `getStaticProps`, nao no componente, porque isso executa uma unica vez no build em vez de toda renderizacao
3. **Exporte o nome exato** — deve ser `export const getStaticProps`, sem variacao, porque o Next.js resolve por convencao de nome
4. **Tipe as props do componente** — crie um type dedicado (ex: `BlogListProps`) e use-o tanto no retorno de `getStaticProps` quanto no componente, porque garante contrato entre servidor e cliente
5. **Retorne sempre o objeto `{ props }` ** — `getStaticProps` deve retornar `{ props: { ... } }`, porque e o contrato da API do Next.js
6. **Remova fetches client-side redundantes** — se o dado vem via props do `getStaticProps`, apague imports e fetches que buscavam o mesmo dado no componente

## How to write

### getStaticProps com ordenacao

```typescript
import { allPosts } from 'contentlayer/generated'
import type { GetStaticProps } from 'next'

export type BlogListProps = {
  posts: Post[]
}

export const getStaticProps: GetStaticProps<BlogListProps> = async () => {
  const sortedPosts = allPosts.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return {
    props: {
      posts: sortedPosts,
    },
  }
}
```

### Componente recebendo props tipadas

```typescript
export default function BlogPage({ posts }: BlogListProps) {
  return <BlogList posts={posts} />
}
```

## Example

**Before (fetch no componente):**
```typescript
import { allPosts } from 'contentlayer/generated'

export default function BlogPage() {
  const posts = allPosts.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  return <BlogList posts={posts} />
}
```

**After (com getStaticProps):**
```typescript
import { allPosts } from 'contentlayer/generated'
import type { GetStaticProps } from 'next'

export type BlogListProps = { posts: Post[] }

export const getStaticProps: GetStaticProps<BlogListProps> = async () => {
  const sortedPosts = allPosts.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  return { props: { posts: sortedPosts } }
}

export default function BlogPage({ posts }: BlogListProps) {
  return <BlogList posts={posts} />
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Listagem de blog/artigos | `getStaticProps` — conteudo muda raramente |
| Conteudo depende de usuario logado | `getServerSideProps` — nao SSG |
| Conteudo muda a cada poucos minutos | ISR com `revalidate` em `getStaticProps` |
| Pagina com slug dinamico | Combine `getStaticPaths` + `getStaticProps` |
| Componente filho precisa dos dados | Passe via props, nao re-importe a source |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `allPosts` direto no componente sem `getStaticProps` | `allPosts` dentro de `getStaticProps`, passe via props |
| `getstaticprops` (nome errado) | `getStaticProps` (exatamente este nome) |
| Sort no componente React | Sort dentro de `getStaticProps` |
| Props sem tipagem (`any`) | Type dedicado: `BlogListProps` |
| `return { posts }` sem wrapper props | `return { props: { posts } }` |

## Troubleshooting

### Dados nao atualizam apos modificacao (SSG/ISR)
**Symptom:** Pagina mostra dados antigos mesmo apos atualizar no banco de dados
**Cause:** Em SSG, a pagina e gerada apenas no build. Em ISR, existe um intervalo de revalidacao
**Fix:** Para SSG, rodar `next build` novamente. Para ISR, aguardar o intervalo de `revalidate` expirar. Para dados que precisam ser sempre frescos, usar SSR com `getServerSideProps`

### getServerSideProps/getStaticProps nao executa
**Symptom:** Funcao de data fetching parece nao ser chamada, dados nao aparecem
**Cause:** Essas funcoes so funcionam em arquivos dentro de `pages/`, nao em componentes ou arquivos fora do diretorio pages
**Fix:** Mover a funcao para o arquivo de pagina dentro de `pages/`. Em App Router, usar fetch direto no Server Component com async/await

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-aplicando-ssg-no-blog/references/deep-explanation.md) — O instrutor explica que um blog tem conteudo essencialmente estatico. Nao muda a cada request. Porta
- [code-examples.md](../../../data/skills/next-js/rs-next-js-aplicando-ssg-no-blog/references/code-examples.md) — import { allPosts, type Post } from 'contentlayer/generated'
