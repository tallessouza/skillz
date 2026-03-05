---
name: rs-next-js-criando-o-component-post-share
description: "Enforces client/server component separation pattern in Next.js App Router when writing React components. Use when user asks to 'create a component', 'refactor component', 'add interactivity', 'use client', or 'split server and client code'. Applies the boundary isolation pattern: extract browser-dependent code into small client components, keep the rest as server components. Make sure to use this skill whenever creating or refactoring Next.js App Router components that mix server and client concerns. Not for Pages Router, API routes, or server actions."
---

# Separacao de Client e Server Components no App Router

> Isole o minimo necessario como client component — todo o resto permanece server component por padrao.

## Rules

1. **Nunca marque uma pagina inteira como client** — extraia apenas o trecho que depende de APIs do browser (`useState`, `useEffect`, hooks customizados com browser APIs) para um componente separado com `'use client'`, porque isso maximiza o que roda no servidor
2. **Crie componentes isolados para cada boundary** — um componente que usa `useShare`, `onClick`, ou qualquer API de browser vira seu proprio arquivo com `'use client'` no topo, porque o boundary se propaga para todos os filhos
3. **Props descritivas no contexto do componente** — renomeie props genericas como `text` para nomes com significado no contexto, como `description`, porque facilita leitura e manutencao
4. **Estrutura de pasta com barrel export** — cada componente em sua pasta com `component.tsx` + `index.ts`, porque padroniza importacoes
5. **Nao esqueca o `'use client'`** — sem ele, o componente e server por padrao e APIs de browser causam erro em runtime

## How to write

### Extraindo um client component

```typescript
// components/post-share/post-share.tsx
'use client'

import { Button } from '@/components/ui/button'
import { useShare } from '@/hooks/use-share'

interface PostShareProps {
  url: string
  title: string
  description: string
}

export const PostShare = ({ url, title, description }: PostShareProps) => {
  const { share } = useShare()

  return (
    <aside>
      <Button onClick={() => share({ url, title, text: description })}>
        Compartilhar
      </Button>
    </aside>
  )
}
```

```typescript
// components/post-share/index.ts
export { PostShare } from './post-share'
```

### Pagina server component consumindo o client component

```typescript
// app/posts/[slug]/page.tsx
// SEM 'use client' — server component por padrao
import { PostShare } from '@/components/post-share'

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  const postUrl = `${process.env.NEXT_PUBLIC_URL}/posts/${params.slug}`

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* Apenas este pedaco e client component */}
      <PostShare
        url={postUrl}
        title={post.title}
        description={post.description}
      />
    </article>
  )
}
```

## Example

**Before (pagina inteira como client):**
```typescript
'use client' // ERRO: toda a pagina vira client

import { useShare } from '@/hooks/use-share'

export default function PostPage({ params }) {
  const post = await getPost(params.slug) // QUEBRA: await em client component
  const { share } = useShare()

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
      <button onClick={() => share({ url: postUrl, title: post.title, text: post.description })}>
        Share
      </button>
    </article>
  )
}
```

**After (boundary isolado):**
```typescript
// page.tsx — server component (fetch no servidor, sem JS no client)
import { PostShare } from '@/components/post-share'

export default async function PostPage({ params }) {
  const post = await getPost(params.slug)
  const postUrl = `${process.env.NEXT_PUBLIC_URL}/posts/${params.slug}`

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
      <PostShare url={postUrl} title={post.title} description={post.description} />
    </article>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente usa `useState`, `useEffect`, event handlers | Extraia para client component isolado |
| Componente faz fetch de dados ou acessa DB | Mantenha como server component |
| Pagina tem 1 botao interativo e 50 linhas de conteudo | Extraia so o botao, mantenha o resto server |
| Props tem nome generico (`text`, `data`) | Renomeie para o contexto (`description`, `users`) |
| Componente filho de client component | Ja e client automaticamente — nao precisa de `'use client'` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `'use client'` no topo da page.tsx | Extraia o trecho interativo para componente separado |
| Props `text` quando significa descricao | Props `description` com nome contextual |
| Componente monolitico com fetch + interatividade | Server component pai + client component filho isolado |
| Esquecer `'use client'` em componente com hooks de browser | Adicionar `'use client'` na primeira linha do arquivo |
| `export default` em barrel files | `export { ComponentName } from './component-name'` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-criando-o-component-post-share/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-criando-o-component-post-share/references/code-examples.md)
