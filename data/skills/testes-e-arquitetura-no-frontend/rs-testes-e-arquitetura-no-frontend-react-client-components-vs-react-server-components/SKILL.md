---
name: rs-testes-arq-frontend-rsc-vs-rcc
description: "Enforces the React Server Component and Client Component separation pattern in Next.js applications. Use when user asks to 'create a component', 'build a sidebar', 'fetch data in Next.js', 'add interactivity', or 'structure a Next.js page'. Applies the wrapper pattern: Server Component fetches data, Client Component handles interactivity, data flows via props. Make sure to use this skill whenever creating Next.js components that need both data fetching and interactivity. Not for pure API routes, middleware, or non-Next.js React projects."
---

# React Server Components vs Client Components

> Em Next.js App Router, separe sempre o fetch de dados (Server Component) da interatividade (Client Component), conectando-os via props.

## Rules

1. **Todo componente na App Router e server por default** — nao adicione "use client" a menos que precise de estado, efeitos ou event handlers, porque codigo de Server Component nao e enviado ao browser
2. **Use o padrao wrapper para componentes que precisam de dados E interatividade** — Server Component externo faz fetch, Client Component interno renderiza UI, porque isso aproveita o melhor dos dois mundos
3. **Server Component pode renderizar Client Component, mas nao o contrario** — tudo dentro de um Client Component vira client, porque a fronteira "use client" propaga para baixo
4. **Server Components podem ser async** — use async/await direto no componente para fetch de dados, porque isso e impossivel em Client Components
5. **Passe dados do server para o client via props** — nunca duplique o fetch no client quando o server ja pode fornecer, porque reduz bundle e elimina waterfalls

## How to write

### Padrao Wrapper (Server busca, Client renderiza)

```typescript
// sidebar.tsx — Server Component (default, sem "use client")
import { prisma } from '@/lib/prisma'
import { SidebarContent } from './sidebar-content'

export async function Sidebar() {
  const prompts = await prisma.prompt.findMany()
  
  return (
    <aside>
      <SidebarContent prompts={prompts} />
    </aside>
  )
}
```

```typescript
// sidebar-content.tsx — Client Component
'use client'

import { useState } from 'react'

interface SidebarContentProps {
  prompts: Array<{ id: string; title: string }>
}

export function SidebarContent({ prompts }: SidebarContentProps) {
  const [search, setSearch] = useState('')
  
  const filtered = prompts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  )
  
  return (
    <aside>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      {filtered.map(prompt => (
        <div key={prompt.id}>{prompt.title}</div>
      ))}
    </aside>
  )
}
```

### Barrel export para o componente externo

```typescript
// components/sidebar/index.ts
export { Sidebar } from './sidebar'
```

## Example

**Before (tudo client, fetch duplicado):**
```typescript
'use client'
import { useEffect, useState } from 'react'

export function Sidebar() {
  const [prompts, setPrompts] = useState([])
  
  useEffect(() => {
    fetch('/api/prompts').then(r => r.json()).then(setPrompts)
  }, [])
  
  return <aside>{/* renderiza prompts */}</aside>
}
```

**After (wrapper pattern aplicado):**
```typescript
// sidebar.tsx — Server Component
import { prisma } from '@/lib/prisma'
import { SidebarContent } from './sidebar-content'

export async function Sidebar() {
  const prompts = await prisma.prompt.findMany()
  return <aside><SidebarContent prompts={prompts} /></aside>
}

// sidebar-content.tsx — Client Component
'use client'
export function SidebarContent({ prompts }: { prompts: Prompt[] }) {
  // toda interatividade aqui: search, click handlers, estado
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Componente precisa de dados do banco | Server Component com async/await |
| Componente precisa de useState/useEffect | Client Component com "use client" |
| Componente precisa de AMBOS | Wrapper pattern: Server fora, Client dentro |
| Componente puramente visual sem estado | Mantenha como Server Component |
| Componente filho de Client Component | Ja e client automaticamente, nao precisa de "use client" |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| useEffect + fetch em client para dados iniciais | async Server Component com acesso direto ao banco |
| "use client" no componente raiz da feature | Wrapper Server Component que delega ao Client |
| Duplicar fetch no client quando server pode fornecer | Passar dados via props do Server para Client |
| Colocar "use client" por precaucao | Adicionar apenas quando interatividade e necessaria |
| Componente monolitico com fetch + estado | Dividir em Server (fetch) + Client (interatividade) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
