---
name: rs-full-stack-controller
description: "Enforces REST API controller pattern with max 5 methods (index, show, create, update, remove) when structuring Express/Node.js applications. Use when user asks to 'create a route', 'add an endpoint', 'organize API', 'separate concerns', or 'create a controller'. Ensures route files only handle routing while controllers handle action logic. Make sure to use this skill whenever creating or refactoring Express routes. Not for frontend components, database models, or middleware logic."
---

# Controller Pattern para REST API

> Separe rotas de controllers: rotas definem caminhos, controllers executam acoes.

## Rules

1. **Maximo 5 metodos por controller** — `index`, `show`, `create`, `update`, `remove`, porque se precisar de um sexto metodo, e sinal de que precisa de um controller separado
2. **Rotas nao executam logica** — a rota chama `controller.metodo`, nunca contem logica de negocio inline, porque misturar roteamento com execucao viola separacao de responsabilidades
3. **Tipe request e response** — importe `Request` e `Response` do Express e tipe os parametros dos metodos, porque sem tipagem voce perde autocomplete e seguranca
4. **Controller como classe** — exporte uma classe, instancie no arquivo de rotas, porque classe organiza os metodos relacionados e permite instanciacao
5. **Nomeie controller pelo recurso** — `ProductsController` para rotas de `/products`, porque o nome indica claramente qual recurso ele gerencia
6. **Pasta dedicada** — controllers ficam em `src/controllers/`, porque separacao fisica reforça separacao logica

## Metodos padrao

| Metodo | HTTP | Proposito |
|--------|------|-----------|
| `index` | GET | Listar varios registros |
| `show` | GET | Exibir um registro especifico |
| `create` | POST | Criar um registro |
| `update` | PUT | Atualizar um registro |
| `remove` | DELETE | Remover um registro |

## How to write

### Controller

```typescript
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

### Rota consumindo o controller

```typescript
import { Router } from "express"
import { ProductsController } from "../controllers/ProductsController"

const productsRoutes = Router()
const productsController = new ProductsController()

productsRoutes.get("/", productsController.index)
productsRoutes.post("/", productsController.create)

export { productsRoutes }
```

## Example

**Before (logica inline na rota):**
```typescript
productsRoutes.get("/", (request, response) => {
  const { page, limit } = request.query
  return response.json({ page, limit })
})

productsRoutes.post("/", (request, response) => {
  const { name, price } = request.body
  return response.json({ name, price })
})
```

**After (controller separado):**
```typescript
// routes/products.routes.ts — so roteamento
productsRoutes.get("/", productsController.index)
productsRoutes.post("/", productsController.create)

// controllers/ProductsController.ts — so execucao
// (metodos index e create com tipagem completa)
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Rota com mais de 3 linhas de logica | Extrair para controller |
| Controller com 6+ metodos | Dividir em dois controllers |
| Mesmo recurso, acoes diferentes | Um unico controller com metodos padrao |
| Middleware antes do controller | Middleware na rota, logica no controller |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Logica de negocio dentro do arquivo de rotas | Mova para o controller |
| Controller sem tipagem de Request/Response | Importe e tipe do Express |
| Nomear metodos livremente (getAll, deleteOne) | Use o padrao: index, show, create, update, remove |
| Controller com 6+ metodos | Crie um segundo controller |
| Instanciar controller dentro de cada rota | Instancie uma vez no topo do arquivo de rotas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de responsabilidades e padronizacao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-controller/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-controller/references/code-examples.md)
