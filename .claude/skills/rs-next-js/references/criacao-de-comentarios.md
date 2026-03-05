---
name: rs-next-js-criacao-de-comentarios
description: "Applies Next.js server action patterns for form submissions that require authenticated server-side requests. Use when user asks to 'create a comment form', 'submit form with authentication', 'forward cookies in Next.js', 'server action with headers', or 'React Hook Form with server components'. Ensures correct header forwarding, server-only imports, and session handling. Make sure to use this skill whenever building authenticated form submissions in Next.js App Router. Not for client-only forms, static pages, or non-authenticated endpoints."
---

# Criacao de Comentarios — Next.js Server Actions com Autenticacao

> Formularios que precisam de autenticacao no Next.js devem usar server actions para garantir que headers/cookies sejam enviados corretamente ao backend.

## Rules

1. **Requisicoes server-side precisam de headers manuais** — no Next.js, requisicoes feitas do server para o backend nao enviam headers automaticamente, porque o browser nao esta envolvido nessa requisicao
2. **Use `server-only` para proteger arquivos server-side** — `import "server-only"` no topo do arquivo impede importacao acidental em client components, gerando erro em build time
3. **Extraia apenas cookies dos headers** — nao repasse todos os headers do request original, porque headers como `content-length` causam erro `Request body length does not match content length header`
4. **Defina `content-type: application/json` explicitamente** — a Fetch API nao adiciona content-type automaticamente como Axios, causando falha silenciosa no parse do body
5. **Use server actions para ponte client-server** — quando um client component precisa executar logica server-side, crie uma funcao com `"use server"` no server component pai e passe como prop
6. **Resolva `isPending` antes de usar session** — `useSession` retorna `isPending: true` inicialmente no client, causando hydration mismatch se usado diretamente para condicionar UI

## How to write

### Rota HTTP server-side com headers

```typescript
// http/create-comment.ts
import "server-only"
import { headers } from "next/headers"
import { getCookiesFromHeaders } from "./utils/get-cookies-from-headers"

export async function createComment({ issueId, text }: CreateCommentParams) {
  const incomingHeaders = await headers()
  const outgoingHeaders = getCookiesFromHeaders(incomingHeaders)

  const response = await fetch(`${url}/api/issues/${issueId}/comments`, {
    method: "POST",
    headers: outgoingHeaders,
    body: JSON.stringify({ text }),
  })

  return response.json()
}
```

### Utilidade para extrair cookies

```typescript
// utils/get-cookies-from-headers.ts
export function getCookiesFromHeaders(headers: HeadersInit) {
  const incomingHeaders = new Headers(headers)
  const cookies = incomingHeaders.get("cookie")
  const outgoingHeaders = new Headers()

  if (cookies) {
    outgoingHeaders.set("cookie", cookies)
  }
  outgoingHeaders.set("content-type", "application/json")

  return outgoingHeaders
}
```

### Server action como ponte

```typescript
// app/issues/[id]/page.tsx (server component)
export default async function IssuePage({ params }: Props) {
  const { id } = params
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  })
  const isAuthenticated = !!session.data?.user

  async function handleCreateComment(text: string) {
    "use server"
    await createComment({ issueId: id, text })
  }

  return (
    <IssueCommentForm
      onCreateComment={handleCreateComment}
      isAuthenticated={isAuthenticated}
    />
  )
}
```

### Client component com React Hook Form + Zod

```typescript
"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const createCommentSchema = z.object({
  text: z.string().min(1, "Comment cannot be empty"),
})
type CreateCommentSchema = z.infer<typeof createCommentSchema>

interface Props {
  onCreateComment: (text: string) => Promise<void>
  isAuthenticated: boolean
}

export function IssueCommentForm({ onCreateComment, isAuthenticated }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<CreateCommentSchema>({ resolver: zodResolver(createCommentSchema) })

  async function handleCreate(data: CreateCommentSchema) {
    await onCreateComment(data.text)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(handleCreate)}>
      <input
        {...register("text")}
        disabled={!isAuthenticated || isSubmitting}
        placeholder={isAuthenticated ? "Leave a comment" : "Sign in to comment"}
      />
      {errors.text && <span>{errors.text.message}</span>}
      <button disabled={!isAuthenticated || isSubmitting} type="submit">
        {isSubmitting ? <Loader2Icon className="size-3 animate-spin" /> : <SendIcon />}
      </button>
    </form>
  )
}
```

## Example

**Before (funcao server-side chamada no client):**
```typescript
"use client"
import { createComment } from "@/http/create-comment" // ERRO: usa headers() server-side

export function CommentForm() {
  async function handleSubmit(data) {
    await createComment({ issueId, text: data.text }) // executa client-side, sem cookies
  }
}
```

**After (server action como ponte):**
```typescript
// page.tsx (server component)
async function handleCreateComment(text: string) {
  "use server"
  await createComment({ issueId: id, text }) // executa server-side, com cookies
}
return <CommentForm onCreateComment={handleCreateComment} />
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Client component precisa chamar API autenticada | Crie server action no server component pai e passe como prop |
| Arquivo usa `headers()` do Next | Adicione `import "server-only"` no topo |
| Fetch para backend proprio do server-side | Extraia apenas cookies, nao repasse todos os headers |
| `useSession` causa hydration mismatch | Verifique autenticacao no server component e passe como prop booleana |
| Fetch API retorna erro de parse no body | Adicione `content-type: application/json` manualmente |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Importar arquivo com `headers()` em client component | Adicione `import "server-only"` para proteger |
| Repassar todos os headers com `headers: await headers()` | Extraia apenas cookies com funcao utilitaria |
| Usar `useSession` para condicionar render inicial | Verifique sessao no server component com `getSession` |
| Confiar que Fetch API envia content-type | Sempre setar `content-type: application/json` explicitamente |
| Chamar funcao server-only diretamente do client | Criar server action com `"use server"` como ponte |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-criacao-de-comentarios/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-criacao-de-comentarios/references/code-examples.md)
