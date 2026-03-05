# Code Examples: Integrando Server Actions com Formularios

## Setup completo do useActionState

```typescript
'use client'

import { useActionState, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { searchPromptAction } from '@/actions/search-prompt-action'

interface Prompt {
  id: string
  title: string
  content: string
}

interface SidebarContentProps {
  prompts: Prompt[]
}

export function SidebarContent({ prompts }: SidebarContentProps) {
  const [query, setQuery] = useState('')
  const formRef = useRef<HTMLFormElement | null>(null)

  const [searchState, searchAction, isPending] = useActionState(
    searchPromptAction,
    { success: true, prompts }
  )

  const hasQuery = query.trim().length > 0
  const promptsList = hasQuery
    ? searchState.prompts ?? prompts
    : prompts

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    // Atualiza URL com search params (logica omitida por brevidade)
    formRef.current?.requestSubmit()
  }

  return (
    <form ref={formRef} action={searchAction} className="group w-full">
      <input
        type="text"
        name="query"
        value={query}
        onChange={handleQueryChange}
        placeholder="Buscar prompts..."
      />

      {isPending && (
        <Loader2
          className="animate-spin"
          title="Carregando prompts"
        />
      )}

      <ul>
        {promptsList.map((prompt) => (
          <li key={prompt.id}>{prompt.title}</li>
        ))}
      </ul>
    </form>
  )
}
```

## Server Action correspondente

```typescript
'use server'

import { db } from '@/lib/db'

interface SearchState {
  success: boolean
  prompts: Prompt[]
}

export async function searchPromptAction(
  previousState: SearchState,
  formData: FormData
): Promise<SearchState> {
  const query = formData.get('query') as string

  const prompts = await db.prompt.findMany({
    where: {
      title: { contains: query, mode: 'insensitive' }
    }
  })

  return { success: true, prompts }
}
```

## Variacao: com debounce no requestSubmit

```typescript
import { useCallback } from 'react'

// Se a busca for muito frequente, adicione debounce
const debouncedSubmit = useCallback(
  debounce(() => {
    formRef.current?.requestSubmit()
  }, 300),
  []
)

function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
  setQuery(e.target.value)
  debouncedSubmit()
}
```

## Variacao: spinner como componente dedicado

```typescript
// Spinner com Lucide React (como usado na aula)
import { Loader2 } from 'lucide-react'

function SearchSpinner({ isPending }: { isPending: boolean }) {
  if (!isPending) return null

  return (
    <Loader2
      className="size-4 animate-spin text-muted-foreground"
      title="Carregando prompts"
      aria-label="Carregando prompts"
    />
  )
}
```

## Padrao completo: form com group styling

```tsx
<form
  ref={formRef}
  action={searchAction}
  className="group w-full"
>
  <div className="relative">
    <input
      type="text"
      name="query"
      value={query}
      onChange={handleQueryChange}
      className="w-full"
    />
    <div className="absolute right-2 top-1/2 -translate-y-1/2">
      {isPending && <Loader2 className="size-4 animate-spin" />}
    </div>
  </div>
</form>
```