# Code Examples: Validacao de Dados com Zod

## Setup completo do controller

```typescript
import { Request, Response, NextFunction } from "express"
import { z } from "zod"

const bodySchema = z.object({
  name: z.string().trim().min(6),
  price: z.number().gt(0),
})

class ProductController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { name, price } = bodySchema.parse(request.body)

      return response.status(201).json({ name, price })
    } catch (error) {
      next(error)
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      // listagem...
      return response.json([])
    } catch (error) {
      next(error)
    }
  }
}

export { ProductController }
```

## Registro de rotas

```typescript
import { Router } from "express"
import { ProductController } from "./product-controller"

const productRoutes = Router()
const productController = new ProductController()

productRoutes.get("/", productController.index)
productRoutes.post("/", productController.create)

export { productRoutes }
```

## Cenarios de teste (do Insomnia)

### Requisicao valida
```json
// POST http://localhost:3000/products
{
  "name": "Porção de batata frita",
  "price": 59.90
}
// Response: 201 { "name": "Porção de batata frita", "price": 59.90 }
```

### Sem price
```json
{
  "name": "Porção de batata frita"
}
// Response: 400 — ZodError: price is "Required"
```

### Price = 0
```json
{
  "name": "Porção de batata frita",
  "price": 0
}
// Response: 400 — "Number must be greater than 0"
```

### Price negativo
```json
{
  "name": "Porção de batata frita",
  "price": -10
}
// Response: 400 — "Number must be greater than 0"
```

### Sem name
```json
{
  "price": 59.90
}
// Response: 400 — ZodError: name is "Required"
```

### Name vazio
```json
{
  "name": "",
  "price": 59.90
}
// Response: 400 — "String must contain at least 6 character(s)"
```

### Name com menos de 6 caracteres
```json
{
  "name": "Pão",
  "price": 5.00
}
// Response: 400 — "String must contain at least 6 character(s)"
```

### Tudo valido com preco minimo
```json
{
  "name": "Suco de laranja",
  "price": 1
}
// Response: 201 { "name": "Suco de laranja", "price": 1 }
```

## Variacoes do schema para outros contextos

### Com mensagem customizada (opcional)
```typescript
const bodySchema = z.object({
  name: z.string().trim().min(6),
  price: z.number().gt(0, { message: "Value must be greater than 0" }),
})
```

### Com campo opcional
```typescript
const bodySchema = z.object({
  name: z.string().trim().min(6),
  price: z.number().gt(0),
  description: z.string().optional(),
})
```

### Para update (campos parciais)
```typescript
const updateBodySchema = bodySchema.partial()
// Agora name e price sao opcionais
```

### Com enum
```typescript
const bodySchema = z.object({
  name: z.string().trim().min(6),
  price: z.number().gt(0),
  category: z.enum(["food", "drink", "dessert"]),
})
```