# Code Examples: React Server Components vs Client Components

## Exemplo 1: Estrutura de pastas do componente Sidebar

O instrutor cria a seguinte estrutura:

```
components/
├── sidebar/
│   ├── index.ts           # barrel export
│   ├── sidebar.tsx         # Server Component (fetch de dados)
│   └── sidebar-content.tsx # Client Component (interatividade)
```

## Exemplo 2: Server Component — Sidebar (fetch de dados)

```typescript
// components/sidebar/sidebar.tsx
import { prisma } from '@/lib/prisma'
import { SidebarContent } from './sidebar-content'

// Sem "use client" — e Server Component por default
// Note: async function — exclusivo de Server Components
export async function Sidebar() {
  const prompts = await prisma.prompt.findMany()
  
  return (
    <aside>
      <SidebarContent prompts={prompts} />
    </aside>
  )
}
```

Pontos-chave:
- Sem "use client" no topo — portanto e Server Component
- Funcao async — impossivel em Client Components
- Acesso direto ao Prisma (banco de dados)
- Unica responsabilidade: buscar dados e repassar via props

## Exemplo 3: Client Component — SidebarContent (interatividade)

```typescript
// components/sidebar/sidebar-content.tsx
'use client'

export function SidebarContent({ prompts }: { prompts: Prompt[] }) {
  // Aqui entra toda a interatividade:
  // - Search input com estado
  // - Click handlers nos botoes
  // - Navegacao para criar novo prompt
  // - Responsividade (media queries com JS)
  
  return (
    <aside>
      {/* Search, botao novo prompt, listagem de prompts */}
    </aside>
  )
}
```

## Exemplo 4: Barrel export

```typescript
// components/sidebar/index.ts
export { Sidebar } from './sidebar'
```

O consumidor importa apenas `Sidebar` — nao precisa saber da divisao interna entre Server e Client.

## Exemplo 5: Diagrama mental do instrutor

```
┌──────────────────────────────────┐
│  Sidebar (Server Component)      │  ← async, fetch do Prisma
│  ┌────────────────────────────┐  │
│  │  SidebarContent (Client)   │  │  ← "use client", interatividade
│  │  ┌──────────────────────┐  │  │
│  │  │  SearchInput         │  │  │  ← useState para busca
│  │  ├──────────────────────┤  │  │
│  │  │  NewPromptButton     │  │  │  ← onClick, navegacao
│  │  ├──────────────────────┤  │  │
│  │  │  PromptList          │  │  │  ← renderiza lista filtrada
│  │  │  ├── PromptItem      │  │  │
│  │  │  ├── PromptItem      │  │  │
│  │  │  └── PromptItem      │  │  │
│  │  └──────────────────────┘  │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

A "barreira" esta entre Sidebar (amarelo/server) e SidebarContent (verde/client). Tudo dentro de SidebarContent e automaticamente client.

## Exemplo 6: Comparacao — abordagem errada vs correta

### Errado: Tudo como Client Component
```typescript
'use client'
import { useEffect, useState } from 'react'

export function Sidebar() {
  const [prompts, setPrompts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch('/api/prompts')
      .then(res => res.json())
      .then(data => {
        setPrompts(data)
        setLoading(false)
      })
  }, [])
  
  // Problemas:
  // 1. Todo JS enviado ao browser (bundle maior)
  // 2. Precisa criar API route so para o fetch
  // 3. Loading state manual
  // 4. Waterfall: HTML → JS → fetch → render
}
```

### Correto: Wrapper pattern
```typescript
// sidebar.tsx (Server Component)
export async function Sidebar() {
  const prompts = await prisma.prompt.findMany()
  return <SidebarContent prompts={prompts} />
}

// sidebar-content.tsx (Client Component)
'use client'
export function SidebarContent({ prompts }: Props) {
  const [search, setSearch] = useState('')
  // Dados ja disponiveis — sem loading, sem fetch, sem API route
}
```