# Code Examples: Zod Nullish

## Exemplo base da aula — Product Controller

### Schema com todos os campos obrigatorios

```typescript
import { z } from "zod"

// Dentro do metodo create do controller
const createProductSchema = z.object({
  name: z.string(),
  price: z.number(),
})

// Uso:
const { name, price } = createProductSchema.parse(request.body)
```

Ao enviar `{ "name": "Produto X" }` sem price → erro:
```json
{
  "errors": [
    {
      "path": ["price"],
      "message": "Required"
    }
  ]
}
```

### Schema com price opcional via nullish

```typescript
const createProductSchema = z.object({
  name: z.string(),
  price: z.number().nullish(),
})

// Agora aceita:
// { "name": "Produto X" }                → OK, price = undefined
// { "name": "Produto X", "price": null } → OK, price = null
// { "name": "Produto X", "price": 29.9 } → OK, price = 29.9
```

## Variacoes praticas

### Schema de update (todos os campos opcionais)

```typescript
const updateProductSchema = z.object({
  name: z.string().nullish(),
  price: z.number().nullish(),
  description: z.string().nullish(),
})
```

### Combinando nullish com valor default

```typescript
const createProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  active: z.boolean().nullish().default(true),
  // Se nao enviado ou null → assume true
})
```

### Comparacao: optional vs nullable vs nullish

```typescript
// .optional() — aceita undefined, rejeita null
const schema1 = z.object({
  field: z.string().optional(), // string | undefined
})
schema1.parse({ field: undefined }) // OK
schema1.parse({ field: null })      // ERRO
schema1.parse({})                   // OK

// .nullable() — aceita null, rejeita undefined/ausencia
const schema2 = z.object({
  field: z.string().nullable(), // string | null
})
schema2.parse({ field: null })      // OK
schema2.parse({ field: undefined }) // ERRO
schema2.parse({})                   // ERRO

// .nullish() — aceita null E undefined
const schema3 = z.object({
  field: z.string().nullish(), // string | null | undefined
})
schema3.parse({ field: null })      // OK
schema3.parse({ field: undefined }) // OK
schema3.parse({})                   // OK
```

### Uso real em controller Fastify/Express

```typescript
async create(request: Request, response: Response) {
  const createProductSchema = z.object({
    name: z.string(),
    price: z.number(),
    description: z.string().nullish(),
    category_id: z.string().uuid().nullish(),
  })

  const { name, price, description, category_id } = createProductSchema.parse(request.body)

  const product = await prisma.product.create({
    data: {
      name,
      price,
      description,  // pode ser null ou undefined — Prisma aceita ambos
      category_id,
    },
  })

  return response.status(201).json(product)
}
```