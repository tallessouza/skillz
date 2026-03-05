# Code Examples: Estrutura de Layout no Next.js App Router

## Layout raiz minimo

```typescript
// app/layout.tsx — NAO coloque header/footer aqui
import { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
```

## Layout do route group (store)

```typescript
// app/(store)/layout.tsx
import { ReactNode } from 'react'
import { Header } from '@/components/header'

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}
```

## Componente header

```typescript
// src/components/header.tsx (lowercase por padrao)
export function Header() {
  return <div>Header</div>
}
```

## Home page com fetch de dados

```typescript
// app/(store)/(home)/page.tsx
export default async function Home() {
  // Simula fetch de dados com delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  return <p>Hello World</p>
}
```

## Loading isolado da home

```typescript
// app/(store)/(home)/loading.tsx
export default function HomeLoading() {
  return <p>Carregando...</p>
}
```

## Search page com fetch

```typescript
// app/(store)/search/page.tsx
export default async function Search() {
  await new Promise(resolve => setTimeout(resolve, 2000))

  return <p>Search results</p>
}
```

## Loading isolado do search

```typescript
// app/(store)/search/loading.tsx
export default function SearchLoading() {
  return <p>Carregando busca...</p>
}
```

## Demonstracao do problema: loading compartilhado

```
# ERRADO — loading.tsx na raiz do route group
app/(store)/
├── layout.tsx
├── loading.tsx       # Este loading afeta home E search
├── page.tsx          # Home
└── search/
    └── page.tsx      # Search (usa o mesmo loading!)

# CORRETO — loading isolado por rota
app/(store)/
├── layout.tsx
├── (home)/
│   ├── page.tsx
│   └── loading.tsx   # So home
└── search/
    ├── page.tsx
    └── loading.tsx   # So search
```

## Estrutura completa do projeto apos a aula

```
app/
├── layout.tsx                    # Raiz (html, body, providers globais)
└── (store)/
    ├── layout.tsx                # Header + estrutura da loja
    ├── (home)/
    │   ├── page.tsx              # / (home)
    │   └── loading.tsx           # Loading da home
    └── search/
        ├── page.tsx              # /search
        └── loading.tsx           # Loading do search
src/
└── components/
    └── header.tsx                # Componente do cabecalho
```