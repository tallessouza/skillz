# Code Examples: Controller Pattern

## Exemplo 1: Controller completo com 5 metodos

```typescript
import { Request, Response } from "express"

class ProductsController {
  // GET /products — listar todos
  index(request: Request, response: Response) {
    const { page, limit } = request.query
    return response.json({ page, limit })
  }

  // GET /products/:id — exibir um
  show(request: Request, response: Response) {
    const { id } = request.params
    return response.json({ id })
  }

  // POST /products — criar
  create(request: Request, response: Response) {
    const { name, price } = request.body
    return response.json({ name, price })
  }

  // PUT /products/:id — atualizar
  update(request: Request, response: Response) {
    const { id } = request.params
    const { name, price } = request.body
    return response.json({ id, name, price })
  }

  // DELETE /products/:id — remover
  remove(request: Request, response: Response) {
    const { id } = request.params
    return response.status(204).send()
  }
}

export { ProductsController }
```

## Exemplo 2: Arquivo de rotas consumindo controller

```typescript
import { Router } from "express"
import { ProductsController } from "../controllers/ProductsController"

const productsRoutes = Router()
const productsController = new ProductsController()

productsRoutes.get("/", productsController.index)
productsRoutes.get("/:id", productsController.show)
productsRoutes.post("/", productsController.create)
productsRoutes.put("/:id", productsController.update)
productsRoutes.delete("/:id", productsController.remove)

export { productsRoutes }
```

## Exemplo 3: Antes e depois (da aula)

### Antes — logica inline nas rotas

```typescript
import { Router } from "express"

const productsRoutes = Router()

productsRoutes.get("/", (request, response) => {
  const { page, limit } = request.query
  return response.json({ page, limit })
})

productsRoutes.post("/", (request, response) => {
  const { name, price } = request.body
  return response.json({ name, price })
})

export { productsRoutes }
```

### Depois — controller separado

```typescript
// src/controllers/ProductsController.ts
import { Request, Response } from "express"

class ProductsController {
  index(request: Request, response: Response) {
    const { page, limit } = request.query
    return response.json({ page, limit })
  }

  create(request: Request, response: Response) {
    const { name, price } = request.body
    return response.json({ name, price })
  }
}

export { ProductsController }
```

```typescript
// src/routes/products.routes.ts
import { Router } from "express"
import { ProductsController } from "../controllers/ProductsController"

const productsRoutes = Router()
const productsController = new ProductsController()

productsRoutes.get("/", productsController.index)
productsRoutes.post("/", productsController.create)

export { productsRoutes }
```

## Exemplo 4: Exportacao — duas formas validas

```typescript
// Forma 1: export no final (usada na aula)
class ProductsController { /* ... */ }
export { ProductsController }

// Forma 2: export inline
export class ProductsController { /* ... */ }
```

## Exemplo 5: Quando dividir controllers

```typescript
// ERRADO: 6 metodos no mesmo controller
class ProductsController {
  index() { /* ... */ }
  show() { /* ... */ }
  create() { /* ... */ }
  update() { /* ... */ }
  remove() { /* ... */ }
  search() { /* ... */ } // sexto metodo — sinal de que precisa separar
}

// CORRETO: dois controllers
class ProductsController {
  index() { /* ... */ }
  show() { /* ... */ }
  create() { /* ... */ }
  update() { /* ... */ }
  remove() { /* ... */ }
}

class ProductSearchController {
  index() { /* ... */ } // GET /products/search?q=...
}
```