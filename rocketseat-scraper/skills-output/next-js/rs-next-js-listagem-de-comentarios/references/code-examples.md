# Code Examples: Listagem de Comentarios

## Estrutura de pastas

```
app/
  issues/
    [id]/
      page.tsx                    # Pagina da issue (ServerComponent)
      issue-comments/
        issue-comment-list.tsx    # Lista de comentarios (async ServerComponent)
        comment.tsx               # Compound component do comentario
```

## Pagina da issue (page.tsx)

```tsx
// Estrutura da pagina que inclui a listagem
export default async function IssuePage({ params }: { params: { id: string } }) {
  const issue = await getIssue(params.id)

  return (
    <div>
      <h1>{issue.title}</h1>

      {/* Secao de comentarios */}
      <div className="flex flex-col gap-2">
        <span className="font-semibold">Comments</span>

        {/* Formulario virá aqui depois */}
        <form>{/* ... */}</form>

        {/* Listagem de comentarios */}
        <div className="mt-3">
          <IssueCommentList issueId={params.id} />
        </div>
      </div>
    </div>
  )
}
```

## Funcao de fetch dos comentarios

```typescript
// http.ts ou api.ts
export async function listIssueComments(issueId: string) {
  const response = await fetch(`${API_URL}/issues/${issueId}/comments`)
  const data: CommentListResponse = await response.json()
  return data // { comments, limit, offset, total }
}
```

## Componente de listagem completo

```tsx
// issue-comments/issue-comment-list.tsx
import { listIssueComments } from '@/http'
import { Comment } from './comment'
import { formatDistanceToNow } from 'date-fns'

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
              <Comment.Time>
                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
              </Comment.Time>
            </Comment.Header>
            <Comment.Text>{comment.body}</Comment.Text>
          </Comment.Content>
        </Comment.Root>
      ))}
    </div>
  )
}
```

## Compound component completo com estilos

```tsx
// issue-comments/comment.tsx
import { ReactNode } from 'react'

function CommentRoot({ children }: { children: ReactNode }) {
  return <div className="flex items-start gap-2">{children}</div>
}

function CommentAvatar({ src }: { src: string }) {
  // Usa <img> ao inves de next/image porque imagens do GitHub ja sao otimizadas
  return <img src={src} alt="" className="size-8 rounded-full" />
}

function CommentContent({ children }: { children: ReactNode }) {
  return (
    <div className="px-3 py-2.5 rounded-lg bg-nave-700 border border-[0.5px] border-nave-600 flex flex-col gap-1">
      {children}
    </div>
  )
}

function CommentHeader({ children }: { children: ReactNode }) {
  return <div className="flex items-baseline gap-1">{children}</div>
}

function CommentAuthor({ children }: { children: ReactNode }) {
  return <span className="text-sm font-medium">{children}</span>
}

function CommentTime({ children }: { children: ReactNode }) {
  return <span className="text-xs text-nave-200">{children}</span>
}

function CommentText({ children }: { children: ReactNode }) {
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

## Exemplo de ClientComponent isolado (botao de deletar)

```tsx
// issue-comments/issue-comment-delete-button.tsx
'use client'

interface DeleteButtonProps {
  commentId: string
}

export function IssueCommentDeleteButton({ commentId }: DeleteButtonProps) {
  async function handleDelete() {
    // Server action ou fetch para deletar
    await fetch(`/api/comments/${commentId}`, { method: 'DELETE' })
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-400 hover:text-red-300"
    >
      Delete
    </button>
  )
}
```

## Uso do botao de deletar dentro do ServerComponent

```tsx
// Dentro do issue-comment-list.tsx — continua sendo ServerComponent
import { IssueCommentDeleteButton } from './issue-comment-delete-button'

// No map dos comentarios:
<Comment.Header>
  <Comment.Author>{comment.author.name}</Comment.Author>
  <Comment.Time>
    {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
  </Comment.Time>
  {/* ClientComponent isolado dentro do ServerComponent */}
  <IssueCommentDeleteButton commentId={comment.id} />
</Comment.Header>
```

## date-fns: formatDistanceToNow

```typescript
import { formatDistanceToNow } from 'date-fns'

// Com addSuffix: true
formatDistanceToNow(new Date('2024-01-15T10:00:00'), { addSuffix: true })
// => "3 months ago"

// Sem addSuffix
formatDistanceToNow(new Date('2024-01-15T10:00:00'))
// => "3 months"

// Com locale pt-BR
import { ptBR } from 'date-fns/locale'
formatDistanceToNow(new Date('2024-01-15T10:00:00'), {
  addSuffix: true,
  locale: ptBR,
})
// => "há 3 meses"
```

## Resposta paginada da API

```typescript
// Tipo da resposta
interface CommentListResponse {
  comments: Comment[]
  limit: number    // default da API
  offset: number   // default da API
  total: number
}

// Desestruturacao — pegue so o que precisa
const { comments } = await listIssueComments(issueId)
// Ignora limit, offset, total quando nao precisa de paginacao
```