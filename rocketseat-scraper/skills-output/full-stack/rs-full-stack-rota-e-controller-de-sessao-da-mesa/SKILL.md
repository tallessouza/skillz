---
name: rs-full-stack-rota-controller-sessao-mesa
description: "Generates Express controller and route files following the restaurant API pattern. Use when user asks to 'create a controller', 'add a route', 'create an endpoint', 'setup express route', or 'create CRUD for a resource'. Applies class-based controllers with try/catch/next, separated route files, and index.ts route registration. Make sure to use this skill whenever scaffolding new Express endpoints or adding resources to an existing Express API. Not for frontend components, database migrations, or middleware creation."
---

# Rota e Controller — Padrao Express Class-Based

> Ao criar endpoints Express, separar controller (classe com metodos) e rotas (arquivo proprio) e registrar no index.

## Rules

1. **Controller como classe** — cada recurso tem sua classe controller com metodos (create, index, update, delete), porque permite organizacao e reutilizacao
2. **Try/catch com next em todo metodo** — erros sempre delegados ao next() para o error handler central, porque evita respostas quebradas
3. **Arquivo de rotas separado por recurso** — `{recurso}-routes.ts` isolado, porque mantem cada dominio independente
4. **Prefixo de rota no index, raiz no arquivo de rotas** — `app.use("/tables-sessions", tablesSessionsRoutes)` e no arquivo de rotas usar apenas `/`, porque evita duplicacao de paths
5. **Import do Router do express** — cada arquivo de rotas cria sua instancia de Router, porque permite composicao modular
6. **Status HTTP correto** — POST retorna 201 (created), GET retorna 200, porque semantica HTTP importa para clientes

## Steps

### Step 1: Criar o Controller

Criar arquivo `src/controllers/{recurso}-controller.ts`:

```typescript
import { Request, Response, NextFunction } from "express"

class TablesSessionsController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      // logica de criacao aqui
      return response.status(201).json()
    } catch (error) {
      next(error)
    }
  }
}

export { TablesSessionsController }
```

### Step 2: Criar o arquivo de rotas

Criar arquivo `src/routes/{recurso}-routes.ts`:

```typescript
import { Router } from "express"
import { TablesSessionsController } from "../controllers/tables-sessions-controller"

const tablesSessionsRoutes = Router()
const tablesSessionsController = new TablesSessionsController()

tablesSessionsRoutes.post("/", tablesSessionsController.create)

export { tablesSessionsRoutes }
```

### Step 3: Registrar no index

No arquivo principal de rotas (`src/routes/index.ts`):

```typescript
import { tablesSessionsRoutes } from "./tables-sessions-routes"

routes.use("/tables-sessions", tablesSessionsRoutes)
```

## Output format

Tres arquivos criados/modificados:
1. `src/controllers/{recurso}-controller.ts` — classe com metodos
2. `src/routes/{recurso}-routes.ts` — rotas com Router
3. `src/routes/index.ts` — registro da rota com prefixo

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo recurso CRUD | Criar controller + routes separados |
| Metodo POST | Retornar status 201 |
| Metodo GET | Retornar status 200 |
| Erro no controller | Delegar com next(error), nunca res.status(500) manual |
| Prefixo de rota | Definir no index.ts, nao no arquivo de rotas |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Rotas inline no index.ts | Arquivo de rotas separado por recurso |
| `res.status(500).json({error})` no catch | `next(error)` delegando ao error handler |
| Controller como funcao avulsa | Classe controller com metodos |
| Prefixo duplicado (index + arquivo de rotas) | Prefixo so no index, raiz no arquivo |
| Tudo num arquivo so | Controller, routes e index separados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes