# Code Examples: Criacao de Comentarios

## Exemplo completo: Rota HTTP com protecao server-only

```typescript
// http/create-comment.ts
import "server-only"
import { headers } from "next/headers"
import { getCookiesFromHeaders } from "@/utils/get-cookies-from-headers"

// Schema de resposta (se necessario)
// import { commentSchema } from "@/schemas/comment"

interface CreateCommentParams {
  issueId: string
  text: string
}

export async function createComment({ issueId, text }: CreateCommentParams) {
  const incomingHeaders = await headers()
  const outgoingHeaders = getCookiesFromHeaders(incomingHeaders)

  const response = await fetch(
    `${process.env.API_URL}/api/issues/${issueId}/comments`,
    {
      method: "POST",
      headers: outgoingHeaders,
      body: JSON.stringify({ text }),
    }
  )

  if (!response.ok) {
    throw new Error("Failed to create comment")
  }

  return response.json()
}
```

## Exemplo completo: Utilidade de extracao de cookies

```typescript
// utils/get-cookies-from-headers.ts
export function getCookiesFromHeaders(headers: HeadersInit): Headers {
  const incomingHeaders = new Headers(headers)
  const cookies = incomingHeaders.get("cookie")

  const outgoingHeaders = new Headers()

  if (cookies) {
    outgoingHeaders.set("cookie", cookies)
  }

  // Fetch API nao adiciona content-type automaticamente
  outgoingHeaders.set("content-type", "application/json")

  return outgoingHeaders
}
```

## Exemplo completo: Page com server action e verificacao de sessao

```typescript
// app/issues/[id]/page.tsx
import { headers } from "next/headers"
import { authClient } from "@/lib/auth-client"
import { createComment } from "@/http/create-comment"
import { IssueCommentForm } from "./issue-comment-form"

interface Props {
  params: { id: string }
}

export default async function IssuePage({ params }: Props) {
  const { id } = params

  // Verificar autenticacao no server para evitar hydration mismatch
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  })

  const isAuthenticated = !!session?.user

  // Server action — executada server-side mesmo quando chamada do client
  async function handleCreateComment(text: string) {
    "use server"
    await createComment({ issueId: id, text })
  }

  return (
    <div>
      {/* Outros componentes da issue */}
      <IssueCommentForm
        onCreateComment={handleCreateComment}
        isAuthenticated={isAuthenticated}
      />
    </div>
  )
}
```

## Exemplo completo: Formulario client com React Hook Form + Zod

```typescript
// app/issues/[id]/issue-comment-form.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { SendIcon, Loader2Icon } from "lucide-react"
import { Input } from "@/components/ui/input"

const createCommentSchema = z.object({
  text: z.string().min(1, "Comment cannot be empty"),
})

type CreateCommentSchema = z.infer<typeof createCommentSchema>

interface IssueCommentFormProps {
  onCreateComment: (text: string) => Promise<void>
  isAuthenticated: boolean
}

export function IssueCommentForm({
  onCreateComment,
  isAuthenticated,
}: IssueCommentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCommentSchema>({
    resolver: zodResolver(createCommentSchema),
  })

  async function handleCreate(data: CreateCommentSchema) {
    await onCreateComment(data.text)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(handleCreate)}>
      <div className="flex items-center gap-2">
        <Input
          {...register("text")}
          disabled={!isAuthenticated || isSubmitting}
          placeholder={
            isAuthenticated ? "Leave a comment" : "Sign in to comment"
          }
        />
        <button
          type="submit"
          disabled={!isAuthenticated || isSubmitting}
        >
          {isSubmitting ? (
            <Loader2Icon className="size-3 animate-spin" />
          ) : (
            <SendIcon className="size-3" />
          )}
        </button>
      </div>
      {errors.text && (
        <span className="text-xs text-red-400 mt-1">
          {errors.text.message}
        </span>
      )}
    </form>
  )
}
```

## Evolucao do debugging na aula

### Problema 1: Hydration mismatch com useSession

```typescript
// PROBLEMA: useSession e async no client, causa mismatch
"use client"
const { data, isPending } = authClient.useSession()
const isAuthenticated = !!data?.user
// No server render: isAuthenticated = false (session ainda nao carregou)
// No client render: isAuthenticated = true (apos carregar)
// -> React avisa sobre hydration mismatch

// SOLUCAO: verificar no server component
// page.tsx (server)
const { data: session } = await authClient.getSession({
  fetchOptions: { headers: await headers() },
})
const isAuthenticated = !!session?.user
// Valor consistente entre server e client
```

### Problema 2: content-length mismatch

```typescript
// PROBLEMA: repassar todos os headers
const response = await fetch(url, {
  method: "POST",
  headers: await headers(), // inclui content-length do request original!
  body: JSON.stringify({ text }),
})
// -> Erro: Request body length does not match content length header

// SOLUCAO: extrair apenas cookies
const outgoingHeaders = getCookiesFromHeaders(await headers())
```

### Problema 3: content-type ausente

```typescript
// PROBLEMA: Fetch API nao adiciona content-type
const response = await fetch(url, {
  method: "POST",
  headers: cookieHeaders, // sem content-type
  body: JSON.stringify({ text }),
})
// -> Backend nao consegue parsear o body: "No value"

// SOLUCAO: adicionar content-type explicitamente
outgoingHeaders.set("content-type", "application/json")
```