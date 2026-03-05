---
name: rs-testes-arq-frontend-server-action-form
description: "Enforces Next.js Server Action integration with forms using useActionState hook. Use when user asks to 'create a search form', 'use server actions', 'implement real-time search', 'useActionState', or 'submit form automatically'. Applies patterns: useActionState for state coordination, useRef for programmatic form submission, isPending for loading states, prioritizing server action state over props. Make sure to use this skill whenever integrating Server Actions with Client Component forms in Next.js. Not for API routes, tRPC, or non-Next.js React projects."
---

# Integrando Server Actions com Formularios

> Ao conectar Server Actions com formularios, use useActionState para coordenar estado e useRef para submissao programatica, mantendo a busca reativa sem botoes de submit.

## Rules

1. **Use useActionState para coordenar action e estado** — `useActionState(serverAction, initialState)` retorna `[state, formAction, isPending]`, porque centraliza a execucao e o estado derivado num unico hook
2. **Passe formAction no atributo action do form** — `<form action={searchAction}>` nao `onSubmit`, porque o Next.js serializa e valida automaticamente via runtime
3. **Use useRef para submissao programatica** — `formRef.current?.requestSubmit()` dentro do onChange, porque permite submit sem botao enquanto o usuario digita
4. **Priorize estado da action sobre props quando ha query** — `hasQuery ? searchState.prompts : prompts`, porque o resultado da action e mais recente que os dados iniciais das props
5. **Use isPending para feedback visual** — exiba spinner durante a busca, porque o usuario precisa saber que a busca esta em andamento
6. **Server Actions funcionam de Client Components** — um Client Component pode disparar uma action executada exclusivamente no servidor, conectando direto ao banco

## How to write

### useActionState + form setup

```typescript
'use client'
import { useActionState, useRef } from 'react'
import { searchPromptAction } from './actions'

function SidebarContent({ prompts }: Props) {
  const formRef = useRef<HTMLFormElement | null>(null)

  const [searchState, searchAction, isPending] = useActionState(
    searchPromptAction,
    { success: true, prompts }
  )

  return (
    <form ref={formRef} action={searchAction} className="group w-full">
      <input
        onChange={(e) => {
          handleQueryChange(e)
          formRef.current?.requestSubmit()
        }}
      />
      {isPending && <Spinner title="Carregando prompts" />}
    </form>
  )
}
```

### Priorizacao de estado

```typescript
const hasQuery = query.trim().length > 0
const promptsList = hasQuery
  ? searchState.prompts ?? prompts
  : prompts
```

## Example

**Before (busca manual sem server action):**
```typescript
const handleSearch = async (query: string) => {
  const res = await fetch(`/api/search?q=${query}`)
  const data = await res.json()
  setResults(data)
}
```

**After (com useActionState e submissao automatica):**
```typescript
const [searchState, searchAction, isPending] = useActionState(
  searchPromptAction,
  { success: true, prompts }
)

// No form: action={searchAction}, ref={formRef}
// No onChange: formRef.current?.requestSubmit()
// Resultado: busca em tempo real via Server Action, sem API route
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Busca em tempo real sem botao submit | useRef + requestSubmit() no onChange |
| Estado inicial da action | Passar os dados das props como fallback |
| Ha query ativa | Priorizar searchState sobre props |
| Carregamento visivel ao usuario | Usar isPending do useActionState |
| Client Component precisa buscar no banco | Server Action, nao API route |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `onSubmit={handleSubmit}` para Server Actions | `action={searchAction}` |
| `fetch('/api/...')` para busca simples | Server Action com useActionState |
| `document.getElementById('form').submit()` | `formRef.current?.requestSubmit()` |
| `useState` + `useEffect` para estado da action | `useActionState(action, initial)` |
| Botao submit para busca em tempo real | requestSubmit() programatico no onChange |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
