# Code Examples: Server Actions e Server Functions

## Exemplo Completo da Aula — `prompt-actions.ts`

```typescript
'use server'

import { prisma } from '@/lib/prisma'

// Tipo para o summary de cada prompt
type PromptSummary = {
  id: string
  title: string
  content: string
}

// Tipo do estado do formulário de busca
type SearchFormState = {
  success: boolean
  prompts?: PromptSummary[]
  message?: string
}

// Server function de busca (não é action porque não muta dados)
// _ = previousState exigido pelo useActionState mas não utilizado aqui
export async function searchPromptAction(
  _: SearchFormState,
  formData: FormData
): Promise<SearchFormState> {
  // Captura e sanitiza o termo de busca
  const term = String(formData.get('q') ?? '').trim()

  try {
    // Busca no Prisma com OR em title e content
    const prompts = await prisma.prompt.findMany({
      where: term
        ? {
            OR: [
              { title: { contains: term, mode: 'insensitive' } },
              { content: { contains: term, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'descending' },
    })

    // Mapeia para formato resumido (não envia dados desnecessários ao cliente)
    const summaries: PromptSummary[] = prompts.map(({ id, title, content }) => ({
      id,
      title,
      content,
    }))

    return { success: true, prompts: summaries }
  } catch {
    return { success: false, message: 'Falha ao buscar prompts' }
  }
}
```

## Variação: Server Action de Criação (Mutação)

```typescript
'use server'

type CreateFormState = {
  success: boolean
  message?: string
}

// ESTA é uma server action de verdade — muta dados (INSERT)
export async function createPromptAction(
  _: CreateFormState,
  formData: FormData
): Promise<CreateFormState> {
  const title = String(formData.get('title') ?? '').trim()
  const content = String(formData.get('content') ?? '').trim()

  if (!title || !content) {
    return { success: false, message: 'Título e conteúdo são obrigatórios' }
  }

  try {
    await prisma.prompt.create({
      data: { title, content },
    })
    return { success: true }
  } catch {
    return { success: false, message: 'Falha ao criar prompt' }
  }
}
```

## Uso no Cliente com useActionState

```typescript
'use client'

import { useActionState } from 'react'
import { searchPromptAction } from '@/app/actions/prompt-actions'

const initialState = { success: true, prompts: [] }

export function SearchSidebar() {
  const [state, formAction] = useActionState(searchPromptAction, initialState)

  return (
    <form action={formAction}>
      <input type="text" name="q" placeholder="Buscar prompts..." />
      <button type="submit">Buscar</button>
      {state.prompts?.map((prompt) => (
        <div key={prompt.id}>
          <h3>{prompt.title}</h3>
          <p>{prompt.content}</p>
        </div>
      ))}
      {!state.success && <p>{state.message}</p>}
    </form>
  )
}
```

## Diretiva `'use server'` — Duas Formas

```typescript
// FORMA 1: No arquivo inteiro (recomendada quando arquivo é dedicado)
'use server'

export async function functionA() { /* server function */ }
export async function functionB() { /* server function */ }

// FORMA 2: Por função individual
export async function functionA() {
  'use server'
  // server function
}
```