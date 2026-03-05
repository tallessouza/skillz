# Code Examples: Aliases de Importação

## Configuracao basica do tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Exemplo do problema: imports relativos profundos

Estrutura simulada pelo instrutor:

```
src/
├── env.ts
├── primeira/
│   └── segunda/
│       └── terceira/
│           └── quarta/
│               └── example.ts
```

Sem alias, `example.ts` importaria:

```typescript
// src/primeira/segunda/terceira/quarta/example.ts
import { env } from '../../../../env'
```

Com alias:

```typescript
import { env } from '@/env'
```

## Configuracao para Vitest

```typescript
// vite.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
```

## Configuracao para Jest

```typescript
// jest.config.ts
export default {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}
```

## Verificando que funciona

```bash
# O tsx le tsconfig paths automaticamente
npm run start:dev
```

O instrutor confirma: "se eu rodar a minha aplicacao, nao deve dar nenhum problema... ja funcionou."

## Exemplo pratico em projeto real

```typescript
// src/http/controllers/users/create.ts
import { makeCreateUserUseCase } from '@/use-cases/factories/make-create-user-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createUserUseCase = makeCreateUserUseCase()
  // ...
}
```

```typescript
// src/use-cases/create-user.ts
// Repository esta proximo — use relativo
import { UsersRepository } from '../repositories/users-repository'

// Lib da raiz do src — use alias
import { prisma } from '@/lib/prisma'
```