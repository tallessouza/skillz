# Code Examples: Tratamento de Erros no Elysia

## Exemplo completo: Modulo de autenticacao com erro

### 1. Classe de erro

```typescript
// src/http/errors/unauthorized-error.ts
export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized')
  }
}
```

### 2. Modulo de autenticacao com registro e tratamento

```typescript
// src/http/auth.ts
import Elysia from 'elysia'
import { UnauthorizedError } from './errors/unauthorized-error'

export const auth = new Elysia()
  .error('UNAUTHORIZED', UnauthorizedError)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'UNAUTHORIZED':
        set.status = 401
        return { code: 'UNAUTHORIZED', message: error.message }
    }
  })
  .derive(async ({ cookie }) => {
    // validacao do JWT
    const user = await validateJwt(cookie.token.value)

    if (!user) {
      throw new UnauthorizedError()
    }

    return { userId: user.sub }
  })
```

### 3. Rota que usa o modulo (herda o erro)

```typescript
// src/http/routes/get-profile.ts
import Elysia from 'elysia'
import { auth } from '../auth'

export const getProfile = new Elysia()
  .use(auth)
  .get('/profile', async ({ userId }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) {
      throw new UnauthorizedError() // funciona porque auth registrou o erro
    }

    return { user }
  })
```

### 4. Servidor com tratamento global

```typescript
// src/http/server.ts
import Elysia from 'elysia'
import { auth } from './auth'
import { getProfile } from './routes/get-profile'

const app = new Elysia()
  .use(auth)
  .use(getProfile)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'VALIDATION':
        set.status = error.status
        return error.toResponse()
      default:
        set.status = 500
        console.error(error)
        return new Response(null, { status: 500 })
    }
  })
  .listen(3333)
```

## Padrao para multiplos erros no mesmo modulo

```typescript
// src/http/errors/not-found-error.ts
export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`)
  }
}

// src/http/errors/forbidden-error.ts
export class ForbiddenError extends Error {
  constructor() {
    super('Forbidden')
  }
}

// Registro no modulo
const ordersModule = new Elysia()
  .error({
    NOT_FOUND: NotFoundError,
    FORBIDDEN: ForbiddenError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'NOT_FOUND':
        set.status = 404
        return { code, message: error.message }
      case 'FORBIDDEN':
        set.status = 403
        return { code, message: error.message }
    }
  })
```

## Estrutura de pastas recomendada

```
src/http/
├── errors/
│   ├── unauthorized-error.ts
│   ├── not-found-error.ts
│   └── forbidden-error.ts
├── routes/
│   ├── get-profile.ts
│   └── send-auth-link.ts
├── auth.ts
└── server.ts
```