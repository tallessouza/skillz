# Code Examples: Instalando o Zod

## Instalacao basica (da aula)

```bash
# Parar servidor
# Ctrl+C

# Instalar Zod com versao fixa
npm i zod@3.23.8

# Verificar que aplicacao funciona
npm run dev
```

## Import padrao

```typescript
import { z } from 'zod'
```

## Schemas comuns para APIs REST

### Validacao de body de criacao
```typescript
const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

type CreateUserInput = z.infer<typeof createUserSchema>
```

### Validacao de parametros de rota
```typescript
const routeParamsSchema = z.object({
  id: z.string().uuid(),
})
```

### Validacao de query params
```typescript
const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
})
```

## Uso com parse (lanca erro se invalido)

```typescript
app.post('/users', (request, reply) => {
  const body = createUserSchema.parse(request.body)
  // body ja tem tipo CreateUserInput inferido
})
```

## Uso com safeParse (retorna resultado sem lancar)

```typescript
app.post('/users', (request, reply) => {
  const result = createUserSchema.safeParse(request.body)
  
  if (!result.success) {
    return reply.status(400).send({ errors: result.error.flatten() })
  }
  
  const body = result.data // tipado corretamente
})
```

## Extraindo tipo do schema

```typescript
const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
})

// Tipo inferido automaticamente — sem duplicacao
type User = z.infer<typeof userSchema>
```