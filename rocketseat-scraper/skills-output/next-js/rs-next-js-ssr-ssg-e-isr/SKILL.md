---
name: rs-next-js-ssr-ssg-e-isr
description: "Applies correct Next.js Pages Router data fetching strategy (SSR, SSG, ISR) when building pages with getServerSideProps, getStaticProps, or revalidate. Use when user asks to 'fetch data in Next.js', 'add getServerSideProps', 'make page static', 'add ISR', 'choose rendering strategy', or 'improve SEO in Next.js'. Make sure to use this skill whenever choosing between SSR/SSG/ISR in Pages Router projects. Not for App Router, React Server Components, or client-side fetching with useEffect."
---

# SSR, SSG e ISR — Next.js Pages Router

> Escolha a estrategia de renderizacao por pagina com base na frequencia de atualizacao dos dados e necessidade de personalizacao.

## Rules

1. **Todas as funcoes de data fetching sao a nivel de pagina** — exportar `getServerSideProps`, `getStaticProps` apenas em arquivos dentro de `pages/`, porque components nao suportam essas funcoes
2. **Use SSR quando dados precisam ser frescos a cada request** — `getServerSideProps` executa no servidor a cada acesso, porque dados autenticados ou personalizados exigem request-time
3. **Use SSG quando dados mudam raramente** — `getStaticProps` executa apenas no build, porque gera HTML estatico com performance maxima e desafoga o servidor
4. **Use ISR quando precisa de balanco entre performance e frescor** — adicione `revalidate` no retorno de `getStaticProps`, porque regenera a pagina em background sem rebuild completo
5. **Pre-renderizacao resolve SEO** — sem server-side rendering, SPAs enviam HTML vazio e motores de busca nao indexam conteudo gerado via JavaScript client-side
6. **Nunca use client-side fetch para dados que precisam de SEO** — `useEffect` + `useState` gera pagina em branco para crawlers com JavaScript desabilitado

## Decision framework

| Situacao | Estrategia | Funcao |
|----------|-----------|--------|
| Dados personalizados por usuario (auth, headers) | SSR | `getServerSideProps` |
| Dados precisam ser atualizados a cada acesso | SSR | `getServerSideProps` |
| Pagina raramente muda (blog, docs, landing) | SSG | `getStaticProps` |
| Pagina muda com pouca frequencia mas nao quer rebuild | ISR | `getStaticProps` + `revalidate` |
| Dados so aparecem apos interacao do usuario | Client-side | `useEffect` + `fetch` |

## How to write

### SSR — getServerSideProps

```typescript
// Executa no servidor A CADA requisicao
export const getServerSideProps: GetServerSideProps = async (context) => {
  // context tem req, res, params, query
  const response = await fetch('https://api.example.com/user', {
    headers: { Authorization: context.req.headers.cookie ?? '' },
  })
  const user = await response.json()

  return { props: { user } }
}
```

### SSG — getStaticProps

```typescript
// Executa APENAS no build — nunca mais ate proximo deploy
export const getStaticProps: GetStaticProps = async () => {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())

  return { props: { posts } }
}
```

### ISR — getStaticProps + revalidate

```typescript
// Estatico com regeneracao automatica a cada N segundos
export const getStaticProps: GetStaticProps = async () => {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())

  return {
    props: { posts },
    revalidate: 60, // regenera a cada 60 segundos
  }
}
```

## Example

**Before (client-side — SEO ruim, pagina em branco para crawlers):**

```typescript
export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false) })
  }, [])

  if (loading) return <p>Loading...</p>
  return <div>{posts.map(p => <p key={p.id}>{p.title}</p>)}</div>
}
```

**After (ISR — SEO excelente, performance estatica, dados atualizados):**

```typescript
export const getStaticProps: GetStaticProps = async () => {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return { props: { posts }, revalidate: 60 }
}

export default function Blog({ posts }: { posts: Post[] }) {
  return <div>{posts.map(p => <p key={p.id}>{p.title}</p>)}</div>
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Blog com posts que mudam 1x por semana | SSG puro |
| E-commerce com precos que mudam diariamente | ISR com revalidate de 3600 (1h) |
| Dashboard autenticado | SSR com getServerSideProps |
| Pagina de perfil publico | ISR com revalidate de 300 (5min) |
| Landing page institucional | SSG puro |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `useEffect` + `fetch` para dados que precisam de SEO | `getStaticProps` ou `getServerSideProps` |
| SSR para pagina que muda 1x por mes | SSG — desafoga o servidor |
| SSG para dados autenticados/personalizados | SSR — precisa de request-time |
| Rebuild completo para atualizar 1 pagina | ISR com `revalidate` |
| `getServerSideProps` em todas as paginas "por seguranca" | Avalie caso a caso — SSG/ISR tem performance superior |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
