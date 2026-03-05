# Code Examples: Rota de Recurso Gerenciado

## Exemplo completo da aula

### getManagedRestaurant.ts

```typescript
import Elysia from 'elysia'
import { auth } from '../auth'
import { db } from '../../db/connection'

export const getManagedRestaurant = new Elysia().use(auth).get(
  '/managed-restaurant',
  async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new Error('User is not a manager.')
    }

    const managedRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, restaurantId)
      },
    })

    return { managedRestaurant }
  }
)
```

### Registro no server

```typescript
import { getManagedRestaurant } from './routes/getManagedRestaurant'

// No arquivo principal do server
app.use(getManagedRestaurant)
```

## Comparacao: getProfile vs getManagedRestaurant

### getProfile (referencia)

```typescript
export const getProfile = new Elysia().use(auth).get(
  '/me',
  async ({ getCurrentUser }) => {
    const { userId } = await getCurrentUser()

    const user = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, userId)
      },
    })

    return { user }
  }
)
```

### getManagedRestaurant (nova rota)

```typescript
export const getManagedRestaurant = new Elysia().use(auth).get(
  '/managed-restaurant',
  async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new Error('User is not a manager.')
    }

    const managedRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, restaurantId)
      },
    })

    return { managedRestaurant }
  }
)
```

**Diferencas-chave:**
1. `userId` → `restaurantId` (campo de ownership)
2. `users` → `restaurants` (tabela)
3. Validacao de undefined adicionada (restaurantId pode ser undefined)
4. Nome da variavel: `user` → `managedRestaurant`

## Pattern generico para qualquer recurso owned

```typescript
export const getOwned{Resource} = new Elysia().use(auth).get(
  '/managed-{resource}',
  async ({ getCurrentUser }) => {
    const { {resourceId} } = await getCurrentUser()

    if (!{resourceId}) {
      throw new Error('User does not manage any {resource}.')
    }

    const managed{Resource} = await db.query.{resources}.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, {resourceId})
      },
    })

    return { managed{Resource} }
  }
)
```