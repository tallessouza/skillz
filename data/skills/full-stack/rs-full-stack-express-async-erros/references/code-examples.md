# Code Examples: Express Async Errors

## 1. Demonstracao do problema (sem a biblioteca)

### Controller que crasha a aplicacao

```typescript
// src/controllers/UsersController.ts
import { Request, Response } from 'express'

class UsersController {
  async create(request: Request, response: Response) {
    // Este throw vai MATAR a aplicacao
    // O Express nao captura erros de funcoes async automaticamente
    throw new Error('Broken')

    return response.json({ message: 'OK' })
  }
}

export { UsersController }
```

**Resultado:** Aplicacao para. Proximas requisicoes falham com "connection refused".

## 2. Solucao padrao (com try-catch e next)

```typescript
// src/controllers/UsersController.ts
import { Request, Response, NextFunction } from 'express'

class UsersController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      throw new Error('Broken')

      return response.json({ message: 'OK' })
    } catch (error) {
      next(error) // Encaminha pro middleware de erro
    }
  }
}

export { UsersController }
```

### Middleware de erro no server.ts

```typescript
// src/server.ts
import express from 'express'
import { routes } from './routes'

const app = express()
app.use(express.json())
app.use(routes)

// Middleware de tratamento de erros (4 parametros!)
app.use((error, request, response, next) => {
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
})

const PORT = 3333
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`)
})
```

**Resultado:** Erro capturado, aplicacao continua rodando, retorna JSON com status 500.

## 3. Solucao simplificada (com express-async-errors)

### Instalacao

```bash
npm i express-async-errors@3.1.1
```

### server.ts atualizado

```typescript
// src/server.ts
import express from 'express'
import 'express-async-errors' // <-- UNICA mudanca no server

import { routes } from './routes'

const app = express()
app.use(express.json())
app.use(routes)

// Middleware de erro permanece igual
app.use((error, request, response, next) => {
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
})

const PORT = 3333
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`)
})
```

### Controller limpo

```typescript
// src/controllers/UsersController.ts
import { Request, Response } from 'express'

class UsersController {
  async create(request: Request, response: Response) {
    // Throw funciona sem try-catch, sem next
    throw new Error('Algo deu errado')

    return response.json({ message: 'OK' })
  }
}

export { UsersController }
```

**Resultado:** Mesmo comportamento da solucao com try-catch, mas sem nenhum boilerplate.

## 4. Variacao: Controller real em producao

```typescript
// src/controllers/UsersController.ts
import { Request, Response } from 'express'

import { prisma } from '../database/prisma'
import { AppError } from '../utils/AppError'

class UsersController {
  async create(request: Request, response: Response) {
    const { name, email, password } = request.body

    const userExists = await prisma.user.findUnique({ where: { email } })

    if (userExists) {
      throw new AppError('Email ja esta em uso', 409)
    }

    const user = await prisma.user.create({
      data: { name, email, password },
    })

    return response.status(201).json(user)
  }

  async index(request: Request, response: Response) {
    const users = await prisma.user.findMany()
    return response.json(users)
  }
}

export { UsersController }
```

Nenhum try-catch. Qualquer erro — seja o `throw new AppError` ou um erro do Prisma — e encaminhado automaticamente para o middleware de erro.

## 5. Variacao: Middleware de erro mais robusto

```typescript
// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    })
  }

  console.error(error)

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
}
```

```typescript
// src/server.ts
import express from 'express'
import 'express-async-errors'

import { routes } from './routes'
import { errorHandler } from './middlewares/errorHandler'

const app = express()
app.use(express.json())
app.use(routes)
app.use(errorHandler)
```

## 6. Estrutura de rotas referenciada na aula

```typescript
// src/routes/users.routes.ts
import { Router } from 'express'
import { UsersController } from '../controllers/UsersController'

const usersRoutes = Router()
const usersController = new UsersController()

usersRoutes.post('/', usersController.create)

export { usersRoutes }
```

```typescript
// src/routes/index.ts
import { Router } from 'express'
import { usersRoutes } from './users.routes'

const routes = Router()

routes.use('/users', usersRoutes)

export { routes }
```