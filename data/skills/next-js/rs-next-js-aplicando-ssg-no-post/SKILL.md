---
name: rs-next-js-aplicando-ssg-no-post
description: "Applies Next.js Pages Router static generation patterns using getStaticProps, getStaticPaths, and ISR when writing dynamic routes. Use when user asks to 'create a dynamic page', 'add SSG to Next.js', 'pre-render pages', 'use getStaticPaths', or 'configure static generation'. Enforces correct fallback strategy, slug-based routing, and incremental static regeneration. Make sure to use this skill whenever generating Next.js Pages Router code with dynamic routes. Not for App Router, API routes, or client-side-only rendering."
---

# SSG em Rotas Dinamicas — Next.js Pages Router

> Rotas dinamicas exigem getStaticPaths para informar ao Next.js quais paginas pre-gerar no build, e getStaticProps para fornecer os dados de cada pagina.

## Rules

1. **Sempre combine getStaticPaths + getStaticProps em rotas dinamicas** — `[slug].tsx` sem getStaticPaths quebra no build, porque o Next nao sabe quais paginas gerar
2. **getStaticPaths retorna paths + fallback** — paths define quais rotas pre-gerar, fallback define o comportamento para rotas nao geradas
3. **Use fallback: "blocking" para conteudo que existe mas nao foi pre-gerado** — o usuario espera a pagina ser gerada no servidor, porque fallback: false retorna 404 para qualquer rota fora do paths
4. **Use fallback: false quando o conjunto de paginas e finito e completo** — todas as rotas possiveis estao no paths, porque nenhuma nova sera gerada apos o build
5. **Retorne notFound: true quando o recurso nao existe** — dentro do getStaticProps, se o dado nao for encontrado, porque isso gera uma pagina 404 correta
6. **Use revalidate para ISR quando dados mudam periodicamente** — adicione `revalidate: seconds` no retorno do getStaticProps, porque permite atualizar paginas estaticas sem novo deploy

## How to write

### getStaticPaths com rotas dinamicas

```typescript
// [slug].tsx — informar ao Next quais paginas gerar
export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = getAllPosts()
  const recentPosts = allPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const paths = recentPosts.map((post) => ({
    params: { slug: post.slug },
  }))

  return { paths, fallback: "blocking" }
}
```

### getStaticProps com contexto de params

```typescript
export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string
  const post = allPosts.find((p) => p.slug === slug)

  if (!post) {
    return { notFound: true }
  }

  return {
    props: { post },
    revalidate: 60 * 30, // ISR: revalida a cada 30 minutos
  }
}
```

## Example

**Before (quebra no build):**
```typescript
// [slug].tsx — SEM getStaticPaths
import { useRouter } from "next/router"
import { allPosts } from "contentlayer/generated"

export default function Post() {
  const router = useRouter()
  const slug = router.query.slug as string
  const post = allPosts.find((p) => p.slug === slug)
  // Quebra no build: slug e undefined em tempo de geracao
  return <div>{post?.title}</div>
}
```

**After (geracao estatica correta):**
```typescript
import { GetStaticPaths, GetStaticProps } from "next"
import { allPosts, Post } from "contentlayer/generated"

interface PostPageProps {
  post: Post
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = allPosts.map((post) => ({
    params: { slug: post.slug },
  }))
  return { paths, fallback: "blocking" }
}

export const getStaticProps: GetStaticProps<PostPageProps> = async ({ params }) => {
  const post = allPosts.find((p) => p.slug === params?.slug)
  if (!post) return { notFound: true }
  return { props: { post } }
}

export default function PostPage({ post }: PostPageProps) {
  return <div>{post.title}</div>
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Blog com posts frequentes | getStaticPaths com ultimos N posts + fallback: "blocking" |
| Pagina de produto com catalogo fixo | getStaticPaths com todos os produtos + fallback: false |
| Dados que mudam ao longo do dia | Adicione revalidate no getStaticProps (ISR) |
| Dados que mudam a cada request | Use getServerSideProps em vez de getStaticProps |
| Rota dinamica `[param].tsx` | Sempre requer getStaticPaths junto com getStaticProps |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `useRouter()` para buscar dados no build | `getStaticProps` com `context.params` |
| `[slug].tsx` sem `getStaticPaths` | Sempre exporte `getStaticPaths` em rotas dinamicas |
| `fallback: false` quando existem mais paginas que as pre-geradas | `fallback: "blocking"` para gerar sob demanda |
| `getServerSideProps` para dados que raramente mudam | `getStaticProps` + `revalidate` (ISR) |
| Acessar `router.query` para logica de servidor | Usar `context.params` dentro de getStaticProps |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
