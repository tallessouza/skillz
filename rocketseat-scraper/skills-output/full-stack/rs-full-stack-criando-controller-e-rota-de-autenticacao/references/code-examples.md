# Code Examples: Criando Controller e Rota de Autenticação

## Exemplo 1: Controller completo de sessões

```typescript
// src/controllers/sessions-controller.ts
import { Request, Response } from 'express'

class SessionsController {
  create(request: Request, response: Response) {
    // Placeholder inicial para testar que a rota funciona
    return response.json({ message: 'ok' })
  }
}

export { SessionsController }
```

## Exemplo 2: Arquivo de rotas de sessões

```typescript
// src/routes/sessions-routes.ts
import { Router } from 'express'
import { SessionsController } from '../controllers/sessions-controller'

const sessionsRoutes = Router()
const sessionsController = new SessionsController()

sessionsRoutes.post('/', sessionsController.create)

export { sessionsRoutes }
```

## Exemplo 3: Index agregando rotas

```typescript
// src/routes/index.ts
import { Router } from 'express'
import { usersRoutes } from './users-routes'
import { sessionsRoutes } from './sessions-routes'

const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/sessions', sessionsRoutes)

export { routes }
```

## Exemplo 4: Controller de usuário com status 201

```typescript
// src/controllers/users-controller.ts
import { Request, Response } from 'express'

class UsersController {
  create(request: Request, response: Response) {
    // ... lógica de criação do usuário ...
    return response.status(201).json(user)
  }
}

export { UsersController }
```

## Variação: Adicionando mais métodos ao controller

```typescript
// Padrão para expandir um controller com novos métodos
class SessionsController {
  // POST /sessions — criar sessão (login)
  create(request: Request, response: Response) {
    return response.json({ token: '...' })
  }

  // DELETE /sessions — destruir sessão (logout)
  destroy(request: Request, response: Response) {
    return response.status(204).send()
  }
}
```

E a rota correspondente:

```typescript
const sessionsRoutes = Router()
const sessionsController = new SessionsController()

sessionsRoutes.post('/', sessionsController.create)
sessionsRoutes.delete('/', sessionsController.destroy)
```

## Variação: Adicionando um terceiro recurso seguindo o mesmo padrão

```typescript
// src/controllers/deliveries-controller.ts
import { Request, Response } from 'express'

class DeliveriesController {
  create(request: Request, response: Response) {
    return response.status(201).json({ message: 'delivery created' })
  }

  index(request: Request, response: Response) {
    return response.json({ deliveries: [] })
  }
}

export { DeliveriesController }
```

```typescript
// src/routes/deliveries-routes.ts
import { Router } from 'express'
import { DeliveriesController } from '../controllers/deliveries-controller'

const deliveriesRoutes = Router()
const deliveriesController = new DeliveriesController()

deliveriesRoutes.post('/', deliveriesController.create)
deliveriesRoutes.get('/', deliveriesController.index)

export { deliveriesRoutes }
```

```typescript
// src/routes/index.ts — atualizado
import { usersRoutes } from './users-routes'
import { sessionsRoutes } from './sessions-routes'
import { deliveriesRoutes } from './deliveries-routes'

routes.use('/users', usersRoutes)
routes.use('/sessions', sessionsRoutes)
routes.use('/deliveries', deliveriesRoutes)
```

## Debugging: Espaços invisíveis em URLs

```
# URL correta
POST http://localhost:3000/sessions  ✅

# URL com espaço invisível (causa 404)
POST http://localhost:3000/ sessions  ❌

# Como detectar: copie a URL e cole num editor que mostre caracteres invisíveis
# Ou use encodeURIComponent() para revelar espaços como %20
```