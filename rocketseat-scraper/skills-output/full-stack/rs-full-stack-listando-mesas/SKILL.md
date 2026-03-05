---
name: rs-full-stack-listando-mesas
description: "Applies the controller-route-register pattern when building REST API list endpoints with Express and Knex. Use when user asks to 'list resources', 'create a GET endpoint', 'add an index route', 'create a controller', or 'setup API routes with Express'. Follows pattern: create type → create controller → create route file → register in index. Make sure to use this skill whenever creating new CRUD list endpoints in Express/Knex projects. Not for frontend components, database migrations, or non-Express APIs."
---

# Listando Recursos — Padrão Controller-Route-Register

> Ao criar um endpoint de listagem, siga sempre a sequência: tipo → controller → rota → registro no index.

## Rules

1. **Crie o tipo do repositorio primeiro** — defina a tipagem em `database/types/` antes de usar no controller, porque tipagem explicita evita erros silenciosos no select
2. **Um controller por recurso** — `tables-controller.ts`, `products-controller.ts`, porque separacao por recurso facilita navegacao e manutencao
3. **Metodo index para listagem** — use `index` como nome do metodo que lista todos os registros, porque e convencao REST amplamente reconhecida
4. **Sempre aplique orderBy** — ao listar registros, inclua `orderBy` explicito, porque ordem implicita do banco nao e garantida
5. **Try-catch com next** — todo metodo de controller usa try/catch e delega erro via `next(error)`, porque o middleware de erro centralizado depende disso
6. **Registre rotas com prefixo no index** — `routes.use("/tables", tablesRoutes)`, porque mantem o index como mapa unico de todos os recursos

## How to write

### Tipo do repositorio

```typescript
// src/database/types/table-repository.d.ts
type TableRepository = {
  id: number
  table_number: number
  created_at: string
  updated_at: string
}
```

### Controller com metodo index

```typescript
// src/tables-controller.ts
import { Request, Response, NextFunction } from "express"
import knex from "@/database/knex"

class TablesController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const tables = await knex<TableRepository>("tables")
        .select()
        .orderBy("table_number")

      return response.json(tables)
    } catch (error) {
      next(error)
    }
  }
}

export { TablesController }
```

### Arquivo de rotas

```typescript
// src/routes/tables-routes.ts
import { Router } from "express"
import { TablesController } from "@/tables-controller"

const tablesRoutes = Router()
const tablesController = new TablesController()

tablesRoutes.get("/", tablesController.index)

export { tablesRoutes }
```

### Registro no index

```typescript
// src/routes/index.ts
import { tablesRoutes } from "./tables-routes"

routes.use("/tables", tablesRoutes)
```

## Example

**Before (tudo misturado no index):**
```typescript
routes.get("/tables", async (req, res) => {
  const data = await knex("tables").select()
  res.json(data)
})
```

**After (com padrao controller-route-register):**
```typescript
// Tipo definido, controller separado, rota registrada
// GET /tables → TablesController.index → select com orderBy → response.json
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo recurso CRUD | Crie tipo → controller → rota → registre no index |
| Listagem simples sem filtro | Use `select().orderBy(campo)` |
| Precisa tipar o retorno do Knex | Crie arquivo `.d.ts` em `database/types/` |
| Varios metodos no mesmo recurso | Adicione ao mesmo controller (index, create, update, remove) |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| Query direto na rota sem controller | Controller separado com classe e metodo |
| `knex("tables")` sem tipagem generica | `knex<TableRepository>("tables")` |
| Listagem sem orderBy | `.select().orderBy("campo")` |
| catch vazio ou com console.log | `catch (error) { next(error) }` |
| Rotas soltas no index.ts | Arquivo de rotas separado por recurso |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre o padrao controller-route-register e fluxo de trás para frente
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes