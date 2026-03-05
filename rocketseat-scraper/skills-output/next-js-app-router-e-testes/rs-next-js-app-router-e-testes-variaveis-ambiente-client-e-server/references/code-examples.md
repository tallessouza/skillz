# Code Examples: Variaveis Ambiente Client e Server

## Instalacao

```bash
npm install @t3-oss/env-nextjs
# Zod ja deve estar instalado no projeto
```

## Exemplo completo do env.ts (da aula)

```typescript
// src/env.ts
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    APP_URL: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  },
  runtimeEnv: {
    APP_URL: process.env.APP_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
})
```

## Antes da mudanca (validacao sem separacao)

```typescript
// src/env.ts — PROBLEMA: nao diferencia client/server
import { z } from 'zod'

const envSchema = z.object({
  APP_URL: z.string().url(),
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
})

export const env = envSchema.parse({
  APP_URL: process.env.APP_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
})
```

Este codigo **quebra** quando importado em um Client Component porque `process.env.APP_URL` sera `undefined` no contexto client.

## Exemplo expandido: projeto com mais variaveis

```typescript
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    APP_URL: z.string().url(),
    DATABASE_URL: z.string().url(),
    STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
    RESEND_API_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_API_BASE_URL: z.string().url(),
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: z.string().startsWith('pk_'),
    NEXT_PUBLIC_GA_ID: z.string().optional(),
  },
  runtimeEnv: {
    APP_URL: process.env.APP_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  },
})
```

## Uso em Server Component

```typescript
// app/page.tsx (Server Component por padrao)
import { env } from '@/env'

export default async function Home() {
  // Pode acessar TODAS as variaveis
  const response = await fetch(`${env.APP_URL}/api/products`)
  const products = await response.json()

  return <ProductList products={products} />
}
```

## Uso em Client Component

```typescript
// components/search.tsx
'use client'

import { env } from '@/env'

export function Search() {
  async function handleSearch(query: string) {
    // Apenas variaveis NEXT_PUBLIC_ funcionam aqui
    const response = await fetch(
      `${env.NEXT_PUBLIC_API_BASE_URL}/search?q=${query}`
    )
    // ...
  }

  return <input onChange={(e) => handleSearch(e.target.value)} />
}
```

## Erro ao acessar variavel server em Client Component

```typescript
// components/admin.tsx
'use client'

import { env } from '@/env'

export function Admin() {
  // ERRO! t3-env bloqueia isso:
  // "❌ SERVER_VAR is not available on the client"
  const dbUrl = env.DATABASE_URL // <- erro em dev e build

  return <div>Admin</div>
}
```

## .env.local correspondente

```env
# Server-only (sem NEXT_PUBLIC_)
APP_URL=http://localhost:3000
DATABASE_URL=postgresql://user:pass@localhost:5432/db
STRIPE_SECRET_KEY=sk_test_abc123
RESEND_API_KEY=re_abc123

# Client + Server (com NEXT_PUBLIC_)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3333
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xyz789
```