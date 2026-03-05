# Code Examples: Middleware de Autenticação no Fastify

## Estrutura de arquivos

```
src/
├── http/
│   ├── middlewares/
│   │   └── auth.ts
│   └── routes/
│       └── get-profile.ts
├── @types/
│   └── fastify.d.ts
└── tsconfig.json
```

## Arquivo completo: auth.ts

```typescript
import fastifyPlugin from 'fastify-plugin'
import { FastifyInstance } from 'fastify'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()
        return sub
      } catch {
        throw new UnauthorizedError('Invalid auth token.')
      }
    }
  })
})
```

## Arquivo completo: fastify.d.ts

```typescript
import 'fastify'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>
  }
}
```

## Arquivo completo: get-profile.ts (uso do middleware)

```typescript
import { FastifyInstance } from 'fastify'
import { auth } from '../middlewares/auth'

export async function getProfile(app: FastifyInstance) {
  app
    .register(auth)
    .get('/profile', async (request) => {
      const userId = await request.getCurrentUserId()

      // buscar usuario no banco com userId
      // retornar dados do perfil
    })
}
```

## tsconfig.json (include necessario)

```json
{
  "compilerOptions": {
    // ...
  },
  "include": ["src", "@types"]
}
```

## Demonstracao: interface merging do TypeScript

```typescript
// Isso funciona com interface (merge automatico):
interface User {
  id: string
}
interface User {
  name: string
}
const user: User = { id: '1', name: 'John' } // exige ambos

// Isso NAO funciona com type:
type Product = { id: string }
type Product = { name: string } // ERRO: Duplicate identifier
```

## Evolucao: sem fastifyPlugin vs com fastifyPlugin

### Sem fastifyPlugin (bug de escopo)

```typescript
// auth.ts — hooks ficam presos no escopo interno
export async function auth(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => { /* ... */ }
  })
}

// get-profile.ts
app.register(auth) // registra, mas hook NAO afeta rotas deste arquivo
app.get('/profile', async (request) => {
  await request.getCurrentUserId() // ERRO: is not a function
})
```

### Com fastifyPlugin (correto)

```typescript
// auth.ts — hooks escapam para o escopo pai
export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => { /* ... */ }
  })
})

// get-profile.ts
app.register(auth) // hooks afetam TODAS as rotas do escopo pai
app.get('/profile', async (request) => {
  await request.getCurrentUserId() // funciona!
})
```

## Variacao: rota que aceita usuario anonimo

```typescript
export async function getPublicContent(app: FastifyInstance) {
  app
    .register(auth)
    .get('/content/:id', async (request) => {
      let userId: string | null = null

      try {
        userId = await request.getCurrentUserId()
      } catch {
        // usuario anonimo — ok, continua sem userId
      }

      const content = await getContent(request.params.id)

      return {
        ...content,
        isOwner: userId === content.authorId,
      }
    })
}
```