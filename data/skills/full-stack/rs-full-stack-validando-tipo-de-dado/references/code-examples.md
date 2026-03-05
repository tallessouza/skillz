# Code Examples: Validacao de Dados com Zod

## Exemplo 1: Antes — Validacao manual (como mostrado na aula)

```typescript
app.post("/products", (request, reply) => {
  const { name, price } = request.body

  if (!name) {
    return reply.status(400).send({ message: "Name is required." })
  }

  if (typeof name !== "string") {
    return reply.status(400).send({ message: "Name must be a string." })
  }

  if (!price) {
    return reply.status(400).send({ message: "Price is required." })
  }

  if (typeof price !== "number") {
    return reply.status(400).send({ message: "Price must be a number." })
  }

  // ... criar produto
})
```

**Problema:** Codigo repetitivo, facil de esquecer validacoes, dificil de manter.

## Exemplo 2: Depois — Com Zod (resultado final da aula)

```typescript
import { z } from "zod"

app.post("/products", (request, reply) => {
  const bodySchema = z.object({
    name: z.string(),
    price: z.number(),
  })

  const { name, price } = bodySchema.parse(request.body)

  // name e price ja validados e com tipagem correta
  // Se body invalido, ZodError e lancado automaticamente
})
```

## Exemplo 3: Testando no Insomnia (cenarios da aula)

### Requisicao valida
```json
{
  "name": "Teclado",
  "price": 120
}
// Resultado: 201 Created
```

### Price como string (tipo errado)
```json
{
  "name": "Teclado",
  "price": "120"
}
// Resultado: ZodError — expected number, received string
```

### Name como numero (tipo errado)
```json
{
  "name": 1,
  "price": 120
}
// Resultado: ZodError — expected string, received number
```

## Exemplo 4: Usando variavel intermediaria (demonstrado na aula)

```typescript
const body = bodySchema.parse(request.body)
// body.name  → string (autocomplete funciona)
// body.price → number (autocomplete funciona)
```

O instrutor mostrou que `body.` ativa o autocomplete do TypeScript com as propriedades corretas.

## Exemplo 5: Variacoes para outros cenarios

### Params schema (rota com ID)
```typescript
const paramsSchema = z.object({
  id: z.string().uuid(),
})

app.get("/products/:id", (request, reply) => {
  const { id } = paramsSchema.parse(request.params)
})
```

### Query schema (filtros)
```typescript
const querySchema = z.object({
  search: z.string().optional(),
  page: z.number().default(1),
})

app.get("/products", (request, reply) => {
  const { search, page } = querySchema.parse(request.query)
})
```

### Schema com mais tipos
```typescript
const bodySchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  tags: z.array(z.string()),
})
```

## Exemplo 6: Schema extraido (reutilizavel)

```typescript
// schemas/product.ts
import { z } from "zod"

export const createProductBodySchema = z.object({
  name: z.string(),
  price: z.number(),
})

// Tipo inferido do schema — sem duplicacao
export type CreateProductBody = z.infer<typeof createProductBodySchema>
```

```typescript
// controllers/products.ts
import { createProductBodySchema } from "../schemas/product"

app.post("/products", (request, reply) => {
  const { name, price } = createProductBodySchema.parse(request.body)
})
```