---
name: rs-next-js-client-e-server-components
description: "Enforces correct separation of Client and Server Components in Next.js App Router projects. Use when user asks to 'create a component', 'add interactivity', 'build a page', 'refactor components', or any Next.js App Router code generation. Applies rules: isolate useClient to smallest possible component, never make async components client-side, extract interactive parts into leaf components. Make sure to use this skill whenever generating Next.js App Router components, even if the user doesn't mention server/client separation. Not for Pages Router, API routes, or non-Next.js React projects."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: fundamentos-app-router
  tags: [server-components, client-components, use-client, next-js, app-router, react]
---

# Client e Server Components no Next.js App Router

> Isole componentes client-side ao maximo, mantendo o maior volume possivel de codigo como Server Components.

## Rules

1. **Nunca coloque `"use client"` em componentes grandes** — extraia apenas as partes interativas em componentes-folha, porque todo JavaScript de um client component e enviado ao navegador
2. **Client components nao podem ser async** — ao adicionar `"use client"`, voce perde `async/await` e so pode carregar dados via hooks (`useEffect`, React Query, etc.)
3. **Isole hooks e event listeners em componentes dedicados** — qualquer `onClick`, `onHover`, `useState`, `useSession` deve viver no menor componente possivel, porque isso permite que o componente pai permaneca como server component
4. **Server Components sao o padrao** — no App Router, todo componente sem `"use client"` e server component por padrao, aproveitando `async/await` para data fetching direto no servidor
5. **Componentes filhos client nao "contaminam" o pai** — um server component pode renderizar client components como filhos sem se tornar client, porque a fronteira e por componente, nao por arvore

## How to write

### Extraindo interatividade para componentes-folha

```tsx
// header/index.tsx — Server Component (sem "use client")
import { SearchInput } from "./search-input"
import { UserButton } from "./user-button"

export async function Header() {
  // Pode usar async/await aqui porque e server component
  const data = await fetchSomething()

  return (
    <header>
      <h1>Board</h1>
      <SearchInput />
      <UserButton />
    </header>
  )
}
```

```tsx
// header/search-input.tsx — Client Component (isolado)
"use client"

import { useRouter } from "next/navigation"

export function SearchInput() {
  const router = useRouter()

  function handleSearch(term: string) {
    router.push(`/?search=${term}`)
  }

  return <input onChange={(e) => handleSearch(e.target.value)} />
}
```

```tsx
// header/user-button.tsx — Client Component (isolado)
"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export function UserButton() {
  const { data: session } = useSession()

  if (session) {
    return <button onClick={() => signOut()}>Sair</button>
  }
  return <button onClick={() => signIn()}>Entrar</button>
}
```

## Example

**Before (tudo client-side desnecessariamente):**
```tsx
"use client"

import { useSession } from "next-auth/react"

// Todo o header vira client component — envia TODO o JS ao navegador
export function Header() {
  const { data: session } = useSession()

  return (
    <header>
      <h1>Board</h1>
      <nav>{/* muitas links estaticas */}</nav>
      <input onChange={(e) => search(e.target.value)} />
      {session ? <button onClick={signOut}>Sair</button> : null}
    </header>
  )
}
```

**After (isolamento correto):**
```tsx
// header/index.tsx — Server Component
import { SearchInput } from "./search-input"
import { UserButton } from "./user-button"

export function Header() {
  return (
    <header>
      <h1>Board</h1>
      <nav>{/* links estaticas — zero JS enviado */}</nav>
      <SearchInput />
      <UserButton />
    </header>
  )
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Componente usa hook (`useState`, `useSession`, etc.) | Extrair para componente-folha com `"use client"` |
| Componente usa event handler (`onClick`, `onChange`) | Extrair para componente-folha com `"use client"` |
| Componente so renderiza HTML/JSX estatico | Manter como server component (sem diretiva) |
| Componente precisa de `async/await` para data fetch | Deve ser server component — remover `"use client"` |
| Componente grande com UMA parte interativa | Quebrar em subcomponentes, isolar a parte interativa |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `"use client"` em componente de pagina inteira | Extraia partes interativas em componentes-folha |
| `"use client"` + `async function Component()` | Remova async ou remova `"use client"` (escolha um) |
| `useEffect` + `fetch` em server component possivel | Use `async/await` direto no server component |
| Um componente gigante com `"use client"` | Quebre em server component pai + client components filhos |
| Colocar `"use client"` "por seguranca" | So adicione quando ha hook ou event listener |

## Troubleshooting

### Erro ao usar hooks em Server Component
**Symptom:** Erro "useState/useEffect is not a function" ou "Hooks can only be called inside a Client Component"
**Cause:** Tentativa de usar hooks React (useState, useEffect, useSession) em um componente sem a diretiva "use client"
**Fix:** Adicionar `"use client"` no topo do arquivo OU extrair a parte interativa para um componente-folha separado com "use client"

### Server Component nao consegue ser async apos adicionar "use client"
**Symptom:** Erro ao usar `async function Component()` com `"use client"`
**Cause:** Client Components nao suportam async/await — essa e uma restricao fundamental do React
**Fix:** Remover "use client" e usar async/await direto (Server Component), ou manter "use client" e buscar dados via hooks (useEffect, React Query)

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-client-e-server-components/references/deep-explanation.md) — No Next.js com App Router, **todo componente e server component por padrao**. Isso e uma mudanca fun
- [code-examples.md](../../../data/skills/next-js/rs-next-js-client-e-server-components/references/code-examples.md) — // components/header.tsx
