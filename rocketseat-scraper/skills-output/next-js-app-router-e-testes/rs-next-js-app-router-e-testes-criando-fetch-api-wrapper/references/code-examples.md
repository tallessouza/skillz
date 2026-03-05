# Code Examples: Fetch API Wrapper no Next.js

## 1. Arquivo .env.local

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

## 2. Validacao de variaveis de ambiente (src/env.ts)

```typescript
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error(
    'Invalid environment variables',
    parsedEnv.error.flatten().fieldErrors,
  )
  throw new Error('Invalid environment variables')
}

export const env = parsedEnv.data
```

### Detalhamento:
- `z.object({...})` — define o schema como um objeto
- `z.string().url()` — valida que o valor e uma string no formato URL
- `safeParse(process.env)` — valida process.env contra o schema sem lancar erro
- `error.flatten().fieldErrors` — formata erros para leitura facil
- `throw` — impede a aplicacao de continuar sem as variaveis

## 3. API Wrapper (src/data/api.ts)

```typescript
import { env } from '@/env'

export function api(path: string, init?: RequestInit) {
  const baseUrl = env.NEXT_PUBLIC_API_BASE_URL
  const url = new URL(path, baseUrl)

  return fetch(url, init)
}
```

### Detalhamento:
- `path: string` — o caminho relativo (ex: `/products`)
- `init?: RequestInit` — opcoes do fetch (method, headers, cache, etc.)
- `new URL(path, baseUrl)` — concatena path com base URL corretamente
- Retorna a Promise do fetch diretamente

## 4. Uso na pagina Home

```typescript
import { api } from '@/data/api'

export default async function Home() {
  const response = await api('/products')
  const products = await response.json()

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  )
}
```

## 5. Uso com opcoes de cache do Next.js

```typescript
// Cache por 1 hora
const response = await api('/products', {
  next: { revalidate: 60 * 60 },
})

// Sem cache
const response = await api('/products', {
  cache: 'no-store',
})

// Cache forcado (default no Next.js)
const response = await api('/products', {
  cache: 'force-cache',
})
```

Essas opcoes de cache **so funcionam porque usamos a Fetch API nativa**. Se estivessemos usando Axios (XMLHttpRequest), nenhuma dessas opcoes teria efeito.

## 6. Adicionando mais variaveis de ambiente

```typescript
const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
})
```

Note que `DATABASE_URL` e `STRIPE_SECRET_KEY` nao tem prefixo `NEXT_PUBLIC_` — elas so estarao disponiveis no server-side.