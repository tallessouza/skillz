# Code Examples: Schema Validation

## Exemplo básico — Email e Senha (do transcript)

O instrutor usa email e senha como exemplos centrais:

```typescript
import { z } from 'zod'

// Email: tipo texto + formato email (tem @, tem .)
// Senha: tipo texto + mínimo 6 caracteres
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
```

O ponto-chave: `email` não é apenas `string`, tem **formato**. `password` não é apenas `string`, tem **tamanho mínimo**.

## Validação completa em rota

```typescript
import { z } from 'zod'
import { FastifyInstance } from 'fastify'

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
})

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', async (request, reply) => {
    const result = createUserSchema.safeParse(request.body)

    if (!result.success) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: result.error.issues,
      })
    }

    const { email, password, name } = result.data

    // Dados garantidamente válidos a partir daqui
    await createUser({ email, password, name })

    return reply.status(201).send()
  })
}
```

## Variações de restrições

```typescript
// String com tamanho mínimo e máximo
const usernameSchema = z.string().min(3).max(20)

// Número com range
const ageSchema = z.number().min(18).max(120)

// Enum — valores específicos permitidos
const roleSchema = z.enum(['admin', 'user', 'moderator'])

// Formato específico — UUID
const userIdSchema = z.string().uuid()

// Formato específico — URL
const websiteSchema = z.string().url()

// Regex customizado
const phoneSchema = z.string().regex(/^\+\d{2}\d{10,11}$/)
```

## Schema para request com params + body

```typescript
const updateUserParamsSchema = z.object({
  userId: z.string().uuid(),
})

const updateUserBodySchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
})

app.put('/users/:userId', async (request, reply) => {
  const paramsResult = updateUserParamsSchema.safeParse(request.params)
  const bodyResult = updateUserBodySchema.safeParse(request.body)

  if (!paramsResult.success) {
    return reply.status(400).send({ errors: paramsResult.error.issues })
  }

  if (!bodyResult.success) {
    return reply.status(400).send({ errors: bodyResult.error.issues })
  }

  const { userId } = paramsResult.data
  const updateData = bodyResult.data

  await updateUser(userId, updateData)

  return reply.status(204).send()
})
```

## Validando as duas dimensões (propriedades + conteúdo)

```typescript
// Esquema que valida ESTRUTURA e CONTEÚDO
const productSchema = z.object({
  // Propriedade obrigatória + tipo string + formato não-vazio
  name: z.string().min(1),

  // Propriedade obrigatória + tipo number + valor positivo
  priceInCents: z.number().int().positive(),

  // Propriedade opcional + se presente, deve ser URL válida
  imageUrl: z.string().url().optional(),

  // Propriedade obrigatória + enum de valores aceitos
  category: z.enum(['electronics', 'clothing', 'food']),
})

// Teste: propriedades corretas, conteúdo inválido
productSchema.safeParse({
  name: '',              // FALHA: min(1) não atendido
  priceInCents: -100,    // FALHA: positive() não atendido
  imageUrl: 'not-a-url', // FALHA: url() não atendido
  category: 'toys',      // FALHA: não está no enum
})
```

## Composição de schemas

```typescript
// Schema base reutilizável
const addressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().regex(/^\d{5}-\d{3}$/),
})

// Compor em schemas maiores
const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).min(1),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
})
```