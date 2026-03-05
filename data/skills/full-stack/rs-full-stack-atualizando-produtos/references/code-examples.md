# Code Examples: Atualizando Produtos

## Exemplo 1: Controller update completo (da aula)

```typescript
async update(request: Request, response: Response, next: NextFunction) {
  try {
    // Validação do ID — chega como string, converte para number
    const id = z
      .string()
      .transform((value) => Number(value))
      .refine((value) => !isNaN(value), { message: "id must be a number" })
      .parse(request.params.id)

    // Validação do body — mesmos campos do create
    const bodySchema = z.object({
      name: z.string().trim().min(6),
      price: z.number().gt(0),
    })

    const { name, price } = bodySchema.parse(request.body)

    // Update com where + updated_at
    await knex<ProductRepository>("products")
      .update({ name, price, updated_at: knex.fn.now() })
      .where({ id })

    return response.status(200).json()
  } catch (error) {
    next(error)
  }
}
```

## Exemplo 2: Rota PUT com param ID

```typescript
// product.routes.ts
import { Router } from "express"
import { ProductsController } from "../controllers/ProductsController"

const productRoutes = Router()
const productsController = new ProductsController()

productRoutes.get("/", productsController.index)
productRoutes.post("/", productsController.create)
productRoutes.put("/:id", productsController.update)  // ← nova rota

export { productRoutes }
```

## Exemplo 3: Testando no Insomnia

### Request válida
```
PUT http://localhost:3000/products/2
Content-Type: application/json

{
  "name": "Executivo de frango grelhado",
  "price": 60.50
}
```

Response: `200 OK`

### Request com ID inválido
```
PUT http://localhost:3000/products/texto-qualquer
```

Response: `400 Bad Request` — "id must be a number"

### Request sem body
```
PUT http://localhost:3000/products/2
```

Response: `400 Bad Request` — name e price são obrigatórios

### Request com body parcial
```
PUT http://localhost:3000/products/2
Content-Type: application/json

{
  "name": "Executivo de frango grelhado"
}
```

Response: `400 Bad Request` — price é obrigatório

## Exemplo 4: Verificando o resultado

Após o update, o GET retorna:
```json
{
  "id": 2,
  "name": "Executivo de frango grelhado",
  "price": 60.50,
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T14:45:22.000Z"  // ← hora diferente
}
```

Note que `created_at` permanece fixo e `updated_at` reflete o momento do último update.

## Variação: Schema compartilhado entre create e update

```typescript
// Se quiser evitar duplicação de schema
const productBodySchema = z.object({
  name: z.string().trim().min(6),
  price: z.number().gt(0),
})

// No create:
const { name, price } = productBodySchema.parse(request.body)

// No update:
const { name, price } = productBodySchema.parse(request.body)
```

## Variação: Param ID como schema reutilizável

```typescript
const paramIdSchema = z
  .string()
  .transform((value) => Number(value))
  .refine((value) => !isNaN(value), { message: "id must be a number" })

// Uso em qualquer controller que recebe ID:
const id = paramIdSchema.parse(request.params.id)
```

## Variação: PATCH em vez de PUT (campos opcionais)

```typescript
// Se fosse PATCH, o schema teria campos opcionais:
const patchBodySchema = z.object({
  name: z.string().trim().min(6).optional(),
  price: z.number().gt(0).optional(),
})

// E o update só incluiria campos presentes:
const updates = patchBodySchema.parse(request.body)
await knex<ProductRepository>("products")
  .update({ ...updates, updated_at: knex.fn.now() })
  .where({ id })
```