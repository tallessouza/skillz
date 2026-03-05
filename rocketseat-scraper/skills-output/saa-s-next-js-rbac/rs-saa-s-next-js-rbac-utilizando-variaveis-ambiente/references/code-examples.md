# Code Examples: Variáveis Ambiente em Next.js Monorepo

## Setup completo do dotenv-cli

### Instalação
```bash
# Na raiz do pacote web
pnpm add -D dotenv-cli
```

### package.json do web
```json
{
  "name": "@saas/web",
  "scripts": {
    "env:load": "dotenv -e ../../.env --",
    "dev": "pnpm env:load next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

### package.json da API (referência)
```json
{
  "name": "@saas/api",
  "scripts": {
    "env:load": "dotenv -e ../../.env --",
    "dev": "pnpm env:load tsx watch src/http/server.ts"
  }
}
```

## Pacote env completo

### packages/env/index.ts
```typescript
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SERVER_PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
  },
  client: {},
  shared: {
    NEXT_PUBLIC_API_URL: z.string().url(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_REDIRECT_URL: z.string().url(),
  },
  runtimeEnv: {
    SERVER_PORT: process.env.SERVER_PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_REDIRECT_URL: process.env.GITHUB_CLIENT_REDIRECT_URL,
  },
})
```

## Uso no API client

### Antes
```typescript
// apps/web/src/http/api-client.ts
import ky from 'ky'

export const api = ky.create({
  prefixUrl: 'http://localhost:3333',
})
```

### Depois
```typescript
import ky from 'ky'
import { env } from '@saas/env'

export const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
})
```

## Uso no GitHub OAuth (Server Actions)

### Antes
```typescript
// apps/web/src/app/actions.ts
const githubSignInURL = `https://github.com/login/oauth/authorize?client_id=HARDCODED_ID&redirect_uri=http://localhost:3000/api/auth/callback`
```

### Depois
```typescript
import { env } from '@saas/env'

const githubSignInURL = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${env.GITHUB_CLIENT_REDIRECT_URL}`
```

## Fix de hydration no theme switcher

### Problema (hydration mismatch)
```tsx
// Renderiza ícone diferente no server vs client
function ThemeSwitcher() {
  const { theme } = useTheme()
  return theme === 'dark' ? <Moon /> : <Sun />
}
```

### Solução (CSS-only toggle)
```tsx
function ThemeSwitcher() {
  return (
    <Button variant="ghost" onClick={toggleTheme}>
      <Sun className="size-4 dark:size-0" />
      <Moon className="size-0 dark:size-4" />
    </Button>
  )
}
```

Ambos os ícones são renderizados no HTML. CSS controla visibilidade:
- Light mode: Sun tem `size-4` (visível), Moon tem `size-0` (invisível)
- Dark mode: Sun tem `dark:size-0` (invisível), Moon tem `dark:size-4` (visível)

## .env na raiz do monorepo

```env
# .env (raiz do monorepo)
NEXT_PUBLIC_API_URL="http://localhost:3333"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_REDIRECT_URL="http://localhost:3000/api/auth/callback"
GITHUB_CLIENT_SECRET="your-github-client-secret"
DATABASE_URL="postgresql://..."
JWT_SECRET="your-jwt-secret"
```