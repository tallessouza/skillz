# Code Examples: Tipagem na Entrada de Dados com Elysia

## Exemplo completo da aula — Criacao de restaurante

```typescript
import { Elysia, t } from 'elysia'

const app = new Elysia()

app.post('/restaurants', ({ body }) => {
  const { restaurantName, managerName, phone, email } = body

  // body ja esta validado e tipado pelo Elysia
  // Se os dados nao baterem com o schema, o Elysia retorna 400 automaticamente

  return {
    message: 'Restaurant created',
    data: { restaurantName, managerName, phone, email }
  }
}, {
  body: t.Object({
    restaurantName: t.String(),
    managerName: t.String(),
    phone: t.String(),
    email: t.String({ format: 'email' }),
  })
})
```

## Variacao: Tipando params

```typescript
app.get('/restaurants/:restaurantId', ({ params }) => {
  return getRestaurantById(params.restaurantId)
}, {
  params: t.Object({
    restaurantId: t.String(),
  })
})
```

## Variacao: Tipando query parameters

```typescript
app.get('/restaurants', ({ query }) => {
  return listRestaurants({
    page: query.page,
    perPage: query.perPage,
  })
}, {
  query: t.Object({
    page: t.Number({ default: 1 }),
    perPage: t.Number({ default: 10 }),
  })
})
```

## Variacao: Combinando body + params

```typescript
app.put('/restaurants/:restaurantId', ({ params, body }) => {
  return updateRestaurant(params.restaurantId, body)
}, {
  params: t.Object({
    restaurantId: t.String(),
  }),
  body: t.Object({
    restaurantName: t.String(),
    managerName: t.String(),
    phone: t.String(),
    email: t.String({ format: 'email' }),
  })
})
```

## Tipos disponiveis no TypeBox (via `t`)

```typescript
// Primitivos
t.String()
t.Number()
t.Boolean()
t.Integer()

// Com formato
t.String({ format: 'email' })
t.String({ format: 'uuid' })
t.String({ format: 'date-time' })

// Compostos
t.Object({ key: t.String() })
t.Array(t.String())
t.Optional(t.String())

// Com restricoes
t.String({ minLength: 3, maxLength: 100 })
t.Number({ minimum: 0, maximum: 100 })
```

## Evolucao do codigo na aula

### Passo 1 — Rota sem tipagem
```typescript
app.post('/restaurants', ({ body }) => {
  // body e `unknown` — sem validacao
  return body
})
```

### Passo 2 — Adicionando terceiro parametro
```typescript
app.post('/restaurants', ({ body }) => {
  return body
}, {
  body: t.Object({
    restaurantName: t.String(),
    name: t.String(),        // generico
    phone: t.String(),
    email: t.String({ format: 'email' }),
  })
})
```

### Passo 3 — Renomeando para clareza
```typescript
app.post('/restaurants', ({ body }) => {
  return body
}, {
  body: t.Object({
    restaurantName: t.String(),
    managerName: t.String(),  // especifico
    phone: t.String(),
    email: t.String({ format: 'email' }),
  })
})
```