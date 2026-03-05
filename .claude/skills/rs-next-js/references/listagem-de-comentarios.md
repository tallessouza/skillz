---
name: rs-next-js-listagem-de-comentarios
description: "Enforces Next.js comment listing patterns with proper Server/Client component isolation. Use when user asks to 'list comments', 'create a comment component', 'build a feed', 'display user posts', or any listing UI with avatars and timestamps. Applies rules: isolate interactive elements into small ClientComponents, keep list components as async ServerComponents, use date-fns formatDistanceToNow for relative timestamps, handle empty states. Make sure to use this skill whenever building listing interfaces in Next.js App Router. Not for form submission, authentication, or API route creation."
---

# Listagem de Comentarios no Next.js App Router

> Componentes de listagem sao ServerComponents assincronos; apenas botoes e interacoes pontuais viram ClientComponents isolados.

## Rules

1. **Listas sao async ServerComponents** — o componente que busca e renderiza a lista usa `async/await` direto, sem useClient, porque isso permite fetch no servidor sem enviar JavaScript desnecessario ao cliente
2. **Isole interacoes em ClientComponents minimos** — um botao de deletar comentario vira `IssueCommentDeleteButton` com useClient proprio, enquanto a lista inteira permanece server, porque isso minimiza a hidratacao
3. **Nao tenha medo de useClient** — React existe desde 2013 para dar experiencia fluida no client-side; o Next remove JavaScript *desnecessario*, nao *todo* JavaScript; use useClient, TanStack Query e interacoes client-side quando melhoram a UX
4. **Use date-fns formatDistanceToNow para timestamps relativos** — com `addSuffix: true` para incluir "ago", porque e a melhor DX para formatacao de datas
5. **Sempre trate o estado vazio** — verifique `items.length === 0` e exiba mensagem amigavel antes de renderizar a lista, porque evita UI quebrada
6. **Componentes compostos para cards** — divida em sub-componentes (Root, Avatar, Content, Header, Author, Time, Text) para manter cada parte estilizavel e reutilizavel

## How to write

### Lista assincrona como ServerComponent

```typescript
// Componente de listagem — SEM useClient
interface IssueCommentListProps {
  issueId: string
}

export default async function IssueCommentList({ issueId }: IssueCommentListProps) {
  const { comments } = await listIssueComments(issueId)

  if (comments.length === 0) {
    return (
      <p className="text-nave-400 text-sm text-center py-2">
        No comments yet.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <Comment.Root key={comment.id}>
          <Comment.Avatar src={comment.author.avatar} />
          <Comment.Content>
            <Comment.Header>
              <Comment.Author>{comment.author.name}</Comment.Author>
              <Comment.Time createdAt={comment.createdAt} />
            </Comment.Header>
            <Comment.Text>{comment.body}</Comment.Text>
          </Comment.Content>
        </Comment.Root>
      ))}
    </div>
  )
}
```

### Componente composto de comentario

```typescript
// comment.tsx — compound component pattern
import { formatDistanceToNow } from 'date-fns'

function CommentRoot({ children }: { children: React.ReactNode }) {
  return <div className="flex items-start gap-2">{children}</div>
}

function CommentAvatar({ src }: { src: string }) {
  return <img src={src} alt="" className="size-8 rounded-full" />
}

function CommentContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 py-2.5 rounded-lg bg-nave-700 border border-nave-600 flex flex-col gap-1">
      {children}
    </div>
  )
}

function CommentHeader({ children }: { children: React.ReactNode }) {
  return <div className="flex items-baseline gap-1">{children}</div>
}

function CommentAuthor({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-medium">{children}</span>
}

function CommentTime({ createdAt }: { createdAt: string }) {
  return (
    <span className="text-xs text-nave-200">
      {formatDistanceToNow(createdAt, { addSuffix: true })}
    </span>
  )
}

function CommentText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-relaxed text-nave-100">{children}</p>
}

export const Comment = {
  Root: CommentRoot,
  Avatar: CommentAvatar,
  Content: CommentContent,
  Header: CommentHeader,
  Author: CommentAuthor,
  Time: CommentTime,
  Text: CommentText,
}
```

### Isolando interacao em ClientComponent

```typescript
// issue-comment-delete-button.tsx
'use client'

export function IssueCommentDeleteButton({ commentId }: { commentId: string }) {
  async function handleDelete() {
    await deleteComment(commentId)
  }

  return <button onClick={handleDelete}>Delete</button>
}
```

## Example

**Before (tudo misturado com useClient):**
```typescript
'use client'
import { useEffect, useState } from 'react'

export function CommentList({ issueId }: { issueId: string }) {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch(`/api/issues/${issueId}/comments`).then(r => r.json()).then(setData)
  }, [issueId])

  return <div>{data.map(d => <div key={d.id}>{d.body}</div>)}</div>
}
```

**After (ServerComponent assincrono + composicao):**
```typescript
// Sem useClient — fetch direto no servidor
export default async function CommentList({ issueId }: { issueId: string }) {
  const { comments } = await listIssueComments(issueId)

  if (comments.length === 0) {
    return <p className="text-sm text-center text-nave-400 py-2">No comments yet.</p>
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <Comment.Root key={comment.id}>
          <Comment.Avatar src={comment.author.avatar} />
          <Comment.Content>
            <Comment.Header>
              <Comment.Author>{comment.author.name}</Comment.Author>
              <Comment.Time createdAt={comment.createdAt} />
            </Comment.Header>
            <Comment.Text>{comment.body}</Comment.Text>
          </Comment.Content>
        </Comment.Root>
      ))}
    </div>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Lista que so exibe dados | async ServerComponent, fetch direto |
| Botao de acao dentro da lista (delete, like) | ClientComponent isolado, importado dentro do ServerComponent |
| Timestamps de criacao/atualizacao | `formatDistanceToNow(date, { addSuffix: true })` |
| Resposta da API tem paginacao | Desestruture `{ comments }` do response, ignore limit/offset/total se nao precisa |
| Lista pode estar vazia | Cheque `.length === 0` ANTES do map, retorne mensagem |
| Card com muitas partes visuais | Compound component (Root, Avatar, Content, Header, etc.) |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|-----------|
| `'use client'` em componente de listagem | async ServerComponent com fetch direto |
| `useEffect` + `useState` para carregar lista | `await` no corpo do ServerComponent |
| useClient na lista inteira por causa de um botao | Extraia so o botao para ClientComponent |
| Mostrar lista vazia sem mensagem | `if (items.length === 0) return <p>No items yet.</p>` |
| `new Date().toLocaleDateString()` para "tempo atras" | `formatDistanceToNow(date, { addSuffix: true })` |
| Um componente monolitico para o card | Compound components com sub-componentes nomeados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-listagem-de-comentarios/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-listagem-de-comentarios/references/code-examples.md)
